import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCartItems,
  updateCartItemById,
  removeCartItemById,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

// /v1/api/cart

router.post("/add", protectRoute, addToCart);

router.get("/", protectRoute, getCartItems);

router.patch("/item/:productId", protectRoute, updateCartItemById);

router.delete("/remove/:productId", protectRoute, removeCartItemById);

router.delete("/clear", protectRoute, clearCart);

export default router;
