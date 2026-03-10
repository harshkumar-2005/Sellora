import { Response } from "express";
import { AuthRequest } from "../types/express.types.js";
import {
  addToCartService,
  getCartItemsService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from "../services/cart.service.js";
import {
  addToCartValidator,
  updateCartValidator,
} from "../validators/cart.validator.js";
import { ZodError } from "zod";

// Add to cart route function
export const addToCart = async (req: AuthRequest, res: Response) => {
  // zod validation.
  const validCartItem = addToCartValidator.parse(req.body);
  const userId = req.user!.userId;

  // async operations.
  try {
    const newCartItem = await addToCartService(
      userId,
      validCartItem.productId,
      validCartItem.quantity,
    );

    res.status(201).json({
      success: true,
      cartItem: newCartItem,
    });
  } catch (err: any) {
    // zod error
    if (err instanceof ZodError) {
      return res.status(400).json({ success: false, errors: err });
    }

    // async operation error
    if (err instanceof Error && err.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // server error
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getCartItems = async (req: AuthRequest, res: Response) => {
  // async operations.
  try {
    const userId = req.user!.userId;
    const cartItems = await getCartItemsService(userId);

    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No items in cart",
      });
    }

    res.status(200).json({
      success: true,
      cartItems,
    });
  } catch (err: any) {
    // server error
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const updateCartItemById = async (req: AuthRequest, res: Response) => {
  // zod validation
  const validCartItem = updateCartValidator.parse(req.body);
  const userId = req.user!.userId;
  const productId = Number(req.params.productId);

  // async operation
  try {
    const updatedCartItem = await updateCartItemService(
      userId,
      productId,
      validCartItem.quantity,
    );

    res.status(200).json({
      success: true,
      message: "Cart updated.",
      cartItem: updatedCartItem,
    });
  } catch (err: any) {
    if (
      err.message === "Invalid quantity" ||
      err.message === "Product not found" ||
      err.message === "Not enough stock available"
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // server error
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const removeCartItemById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const productId = Number(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
      });
    }
    // remove item from the cart
    await removeCartItemService(userId, productId);

    res.status(200).json({
      success: true,
      message: "Cart item removed.",
    });
  } catch (err: any) {
    // server error
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    await clearCartService(userId);

    res.status(200).json({
      success: false,
      message: "Your cart is empty.",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
