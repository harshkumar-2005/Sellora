import { AuthRequest } from "../types/express.types.js";
import { Response } from "express";
import {
  checkoutService,
  getOrderByIdService,
  getUserOrdersService,
  getAllOrdersAdminService,
  updateOrderStatusService,
} from "../services/order.service.js";

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const userId = req.user.userId;
    const order = await checkoutService(userId);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err: any) {
    if (
      err.message === "Cart is empty" ||
      err.message.startsWith("Insufficient stock")
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Server error
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {

  const userId: number = req.user!.userId;
  const page: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 10;

  try {
    const {data, pagination} = await getUserOrdersService(userId!,page, limit);

    res.status(200).json({
      success: true,
      message: "Order found",
      orders: data,
      pagination
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.userId;
    const orderId = Number(req.params.id);

    const order = await getOrderByIdService(orderId, userId);
    
    res.status(200).json({
      success: true,
      message: "Order found",
      order,
    });
  } catch (err: any) {
    if (err.message === "Order not found") {
      return res.status(404).json({
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

export const getAllOrders = async(req: AuthRequest, res: Response)=>{
  try {
    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 10;
    const { data, pagination } = await getAllOrdersAdminService(page, limit);

    res.status(200).json({
      success: true,
      message: "Order found",
      orders: data,
      pagination
    });
  }catch(err: any){
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const order = await updateOrderStatusService(orderId, status);

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order
    });

  } catch (err: any) {

    if (err.message === "Order not found") {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};