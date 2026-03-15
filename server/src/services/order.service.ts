import { OrderStatus } from "@prisma/client";
import prisma from "../lib/prisma.js";
import getPagination from "../utils/pagination.util.js";

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

  // Fetch user's default address
  const address = await prisma.address.findFirst({
    where: { userId },
    orderBy: { id: "asc" }, // assuming first address is default
  });

  if (!address) {
    throw new Error("No address found for user");
  }

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: OrderStatus.PENDING,
      shippingName: address.name,
      shippingPhone: address.phone,
      shippingLine1: address.line1,
      shippingLine2: address.line2 ?? "",
      shippingCity: address.city,
      shippingState: address.state,
      shippingPostalCode: address.postalCode,
      shippingCountry: address.country,
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

export const getUserOrdersService = async (
  userId: number,
  page: number,
  limit: number,
) => {
  const { pages, limits, skip } = getPagination(page, limit);

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    skip,
    take: limits,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
    },
  });

  const totalOrders = await prisma.order.count({
    where: {
      userId,
    },
  });

  return {
    data: orders,
    pagination: {
      page: pages,
      limit: limits,
      total: totalOrders,
      totalPages: Math.ceil(totalOrders / limits),
    },
  };
};

export const getOrderByIdService = async (orderId: number, userId: number) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: userId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

export const getAllOrdersAdminService = async (page: number, limit: number) => {
  const { pages, limits, skip } = getPagination(page, limit);

  const orders = await prisma.order.findMany({
    skip,
    take: limits,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
      user: true,
    },
  });

  const totalOrders = await prisma.order.count();

  return {
    data: orders,
    pagination: {
      page: pages,
      limit: limits,
      total: totalOrders,
      totalPages: Math.ceil(totalOrders / limits),
    },
  };
};

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
