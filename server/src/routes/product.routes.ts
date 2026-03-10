import express from "express";
import {getProducts,getProductById,createProduct,updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminCheck.middleware.js";
import validatedProduct from "../middleware/validProduct.middleware.js";

const router = express.Router();

// /v1/api/auth/products

// public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// admin routes
router.post("/", protectRoute, adminOnly, validatedProduct, createProduct);
router.patch("/:id", protectRoute, adminOnly, validatedProduct, updateProduct);
router.delete("/:id", protectRoute, adminOnly, deleteProduct);

export default router;
