import { Request, Response, NextFunction } from "express";
import validProduct from "../validators/product.validator.js";

const validatedProduct = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedProduct = validProduct.parse(req.body);

    req.body = validatedProduct; // sanitized data
    next();

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid product data",
    });
  }
};

export default validatedProduct;