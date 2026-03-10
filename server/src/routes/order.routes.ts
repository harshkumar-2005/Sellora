import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminCheck.middleware.js";
import { checkout, getOrderById, getOrderUser, getAllOrders, updateStatus } from "../controllers/order.controller.js";

const router = express.Router();

// pubic routes
router.post('/', protectRoute, checkout);
router.get('/', protectRoute, getOrderUser);

// admin routes
router.get('/admin/orders', protectRoute, adminOnly, getAllOrders);
router.patch('/admin/:id/status', protectRoute, adminOnly, updateStatus);

// dynamic
router.get('/:id', protectRoute, getOrderById);

export default router;