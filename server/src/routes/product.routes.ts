import express from "express";
import {getProducts,getProductById,createProduct,updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminCheck.middleware.js";

const router = express.Router();

// public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// admin routes
router.post("/", protectRoute, adminOnly, createProduct);
router.patch("/:id", protectRoute, adminOnly, updateProduct);
router.delete("/:id", protectRoute, adminOnly, deleteProduct);

export default router;
