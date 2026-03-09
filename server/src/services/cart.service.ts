import prisma from "../lib/prisma.js";

// Add → create or increase quantity
export const addToCartService = async (userId: number,productId: number,quantity: number) => {

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (product.stock < newQuantity) {
      throw new Error("Not enough stock available");
    }

    return prisma.cartItem.update({
      where: {
        userId_productId: { userId, productId },
      },
      data: {
        quantity: newQuantity,
      },
    });
  }

  if (product.stock < quantity) {
    throw new Error("Not enough stock available");
  }

  return prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity,
    },
  });
};

// Get → fetch cart items
export const getCartItemsService = async (userId: number) => {
  const cartItems = await prisma.cartItem.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: true,
    },
  });

  return cartItems;
};

// Update → modify quantity
export const updateCartItemService = async (
  userId: number,
  productId: number,
  quantity: number
) => {

  if (quantity <= 0) {
    throw new Error("Invalid quantity");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Not enough stock available");
  }

  return prisma.cartItem.update({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    data: {
      quantity,
    },
  });
};

// Update → modify quantity
export const removeCartItemService = async (userId: number, productId: number) => {
    return prisma.cartItem.delete({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
};

// Clear → delete all items
export const clearCartService = async (userId: number) => {
    return prisma.cartItem.deleteMany({
        where: {
            userId,
        },
    });
};

