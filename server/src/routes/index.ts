import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/products", productRoutes);

router.use("/cart", cartRoutes);

router.use("/orders", orderRoutes);

export default router;
