import prisma from "../lib/prisma.js";
import getPagination from "../utils/pagination.util.js";

async function updateProductRating(productId: number) {
  const stats = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      averageRating: stats._avg.rating || 0,
      reviewCount: stats._count.rating,
    },
  });
}

export const createReviewService = async (
  userId: number,
  productId: number,
  rating: number,
  comment?: string,
) => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingReview) {
    throw new Error("You already reviewed this product");
  }

  const review = await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment,
    },
  });

  await updateProductRating(productId);

  return review;
};

export const getReviewsByProductIdService = async (productId: number, page: number, limit: number) => {

  const { pages, limits, skip } = getPagination(page, limit);

  const reviews = await prisma.review.findMany({
    where: { productId },
    skip,
    take: limits,
    orderBy: {
      createdAt: "desc"
    }
  });

  const totalReviews = await prisma.review.count({
    where: { productId }
  });

  return {
    data: reviews,
    pagination: {
      page: pages,
      limit: limits,
      total: totalReviews,
      totalPages: Math.ceil(totalReviews / limits)
    }
  };
};

export const updateReviewService = async (
  reviewId: number,
  userId: number,
  rating: number,
  comment: string,
) => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== userId) {
    throw new Error("Unauthorized");
  }
  const updatedReview = prisma.review.update({
    where: { id: reviewId },
    data: { rating, comment },
  });

  await updateProductRating(review.productId);

  return updatedReview;
};

export const deleteReviewService = async (reviewId: number, userId: number) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const deleted = prisma.review.delete({
    where: { id: reviewId },
  });

  await updateProductRating(review.productId);

  return deleted;
};
