import envconfig from "../config/env.config.js";
import prisma from "../lib/prisma.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: envconfig.razorpayKeyId,
  key_secret: envconfig.razorpayKeySecret,
});

export const createOrderService = async (orderId: number, userId: number) => {
  const existingPayment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (existingPayment) {
    throw new Error("Payment already initiated for this order");
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount,
    currency: "INR",
    receipt: `order_${orderId}`,
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "RAZORPAY",
      providerOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      currency: "INR",
    },
  });

  return { payment, razorpayOrder };
};

export const verifyPaymentService = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  expectedSignature: string,
) => {
  if (razorpay_signature !== expectedSignature) {
    return false;
  }

  const payment = await prisma.payment.update({
    where: { providerOrderId: razorpay_order_id },
    data: {
      providerPaymentId: razorpay_payment_id,
      status: "SUCCESS",
    },
  });

  await prisma.order.update({
    where: { id: payment.orderId },
    data: { status: "CONFIRMED" },
  });

  return true;
};

export const handleWebhookService = async (event: string, payment: any) => {
  if (event === "payment.captured") {
    await prisma.payment.update({
      where: { providerPaymentId: payment.id },
      data: { status: "SUCCESS" },
    });
  }
};

export const getPaymentDetailsService = async (orderId: number) => {
  const payment = await prisma.payment.findUnique({
    where: {
      orderId: orderId,
    },
  });
  return payment;
};
