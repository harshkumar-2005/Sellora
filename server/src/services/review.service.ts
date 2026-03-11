import prisma from "../lib/prisma.js";

export const createReviewService = async (userId: number, productId: number, rating: number, comment: string) => {
    const review = await prisma.review.create({
        data: {
            userId,
            productId,
            rating,
            comment,
        },
    });

    // Update product's average rating and review count
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { reviews: true },
    });
    if (product) {
        const averageRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;
        await prisma.product.update({
            where: { id: productId },
            data: {
                averageRating,
                reviewCount: product.reviews.length,
            },
        });
    }

    // increase the review count of the user
    await prisma.user.update({
        where: { id: userId },
        data: { 
            reviewCount: {
                increment: 1,
            },
        },
    });

    return review;
};

export const getReviewsByProductIdService = (productId: number) => {
    return prisma.review.findMany({
        where: { productId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            }
        },
    });
}

export const updateReviewService = async (reviewId: number, rating: number, comment: string) => {
    return prisma.review.update({
        where: { id: reviewId },
        data: { rating, comment },
    });
};

export const deleteReviewService = async (reviewId: number) => {
    return prisma.review.delete({
        where: { id: reviewId },
    });
};
