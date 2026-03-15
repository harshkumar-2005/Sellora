import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import reviewRoutes from "./review.routes.js";
import otpRoutes from "./otp.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/otp", otpRoutes);

router.use("/products", productRoutes);

router.use("/cart", cartRoutes);

router.use("/orders", orderRoutes);

router.use("/wishlist", wishlistRoutes);

router.use("/products", reviewRoutes);

router.use("/payments", paymentRoutes);

export default router;
