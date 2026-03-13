import express from "express";
import {getProducts,getProductById,createProduct,updateProduct, deleteProduct, getAdminProducts } from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminCheck.middleware.js";
import validatedProduct from "../middleware/validProduct.middleware.js";

const router = express.Router();

// /v1/api/auth/products

router.get("/", getProducts);

router.get("/admin/products", protectRoute, adminOnly, getAdminProducts);

router.post("/", protectRoute, adminOnly, validatedProduct, createProduct);

router.patch("/:id", protectRoute, adminOnly, validatedProduct, updateProduct);

router.delete("/:id", protectRoute, adminOnly, deleteProduct);

router.get("/:id", getProductById);

export default router;
