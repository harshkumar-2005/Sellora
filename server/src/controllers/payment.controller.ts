import { AuthRequest } from "../types/express.types.js";
import { Request, Response } from "express";
import crypto from "crypto";
import {
  createOrderService,
  verifyPaymentService,
  handleWebhookService,
  getPaymentDetailsService,
} from "../services/payment.service.js";
import envconfig from "../config/env.config.js";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId: number = req.user?.userId ?? 0;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const { payment, razorpayOrder } = await createOrderService(
      orderId,
      userId,
    );

    res.status(201).json({
      payment,
      razorpayOrder,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  if (!envconfig.razorpayKeySecret) {
    return res.status(500).json({
      success: false,
      message: "Razorpay key secret is not configured",
    });
  }
  const expectedSignature: string = crypto
    .createHmac("sha256", envconfig.razorpayKeySecret)
    .update(body.toString())
    .digest("hex");

  const verified = await verifyPaymentService(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    expectedSignature,
  );

  if (verified) {
    res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const handleWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const signature = req.headers["x-razorpay-signature"] as string;

    if (!envconfig.razorpayWebhookSecret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay webhook secret is not configured",
      });
    }
    const expectedSignature = crypto
      .createHmac("sha256", envconfig.razorpayWebhookSecret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const event = req.body.event;

    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;
      await handleWebhookService(event, payment);
    }

    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getPaymentDetails = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = Number(req.params.orderId);

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const payment = await getPaymentDetailsService(orderId);

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};
