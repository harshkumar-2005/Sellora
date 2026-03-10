import { OrderStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";

export const checkoutService = async (userId: number) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      throw new Error(`Insufficient stock for product ${item.product.name}`);
    }
  }

  const totalAmount = cartItems.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: OrderStatus.PENDING,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return order;
};

export const getOrderUserService = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
  });

  return orders;
};

export const getOrderByIdService = async (
  orderId: number,
  userId: number
) => {

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId
    }
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

export const getAllOrdersAdminService = async ()=>{
    const allOrders = await prisma.order.findMany({});
    return allOrders;
}

export const updateOrderStatusService = async (
  orderId: number,
  status: OrderStatus,
) => {
  if (!Object.values(OrderStatus).includes(status)) {
  throw new Error("Invalid order status");
}
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return order;
};
