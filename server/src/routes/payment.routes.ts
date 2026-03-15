import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createOrder, verifyPayment, handleWebhook, getPaymentDetails } from "../controllers/payment.controller.js";

const router = express.Router();

// v1/api/payments

// Create Razorpay order
router.post("/create-order", protectRoute, createOrder);

// Verify payment
router.post("/verify", protectRoute, verifyPayment);

// Razorpay webhook 
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

// Get payment details
router.get("/:orderId", protectRoute, getPaymentDetails);

// export router
export default router;
