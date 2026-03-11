import prisma from "../lib/prisma.js";

export const addToWishlistService = async (userId: number, productId: number) => {

  try {

    return await prisma.wishlistItem.create({
      data: { userId, productId }
    });

  } catch (error: any) {

    if (error.code === "P2002") {
      throw new Error("Product already in wishlist");
    }

    throw error;
  }

};

export const getWishlistService = async (userId: number) => {

  return prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: true }
  });

};

export const removeItemWishlistService = async (userId: number, productId: number) => {

  return prisma.wishlistItem.delete({
    where: {
      userId_productId: { userId, productId }
    }
  });

};

export const emptyWishlistService = async (userId: number) => {

  return prisma.wishlistItem.deleteMany({
    where: { userId }
  });

};