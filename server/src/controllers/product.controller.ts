import { AuthRequest } from "../types/express.types.js";
import { Request, Response } from "express";
import {createProductService, getProductService, getProductByIdService, updateProductService, deleteProductService, getAdminProductsService} from "../services/product.service.js";

// public routes
export const getProducts = async (req: Request, res: Response) => {
  try {
    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    // sanitize inputs
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 50) limit = 10;

    const category = req.query.category as string;
    const search = req.query.search as string;
    const sort = req.query.sort as string;

    const {data, pagination } = await getProductService(page, limit, category, search, sort);

    res.json({
      success: true,
      products: data,
      pagination
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// public route
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await getProductByIdService(Number(req.params.id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // response
    res.json({
      success: true,
      product,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};  
  
// Admin route
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await createProductService(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

// Admin route
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const product = await updateProductService(id, req.body);

    res.json({
      success: true,
      product,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
};

// Admin route
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    await deleteProductService(id);

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
};

export const getAdminProducts = async (req: AuthRequest, res: Response) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const products = await getAdminProductsService(page, limit);
    res.json({
      success: true,
      products: products.data,
      pagination: products.pagination
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
};