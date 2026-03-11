import { Response } from "express";
import { AuthRequest } from "../types/express.types.js";
import { createReviewService, getReviewsByProductIdService, updateReviewService, deleteReviewService } from "../services/review.service.js";

export const createReview = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    const productId = Number(req.params.productId);
    const { rating, comment } = req.body;

    try {
        const review = await createReviewService(userId, productId, rating, comment);
        res.status(201).json({ success: true, review });
    } catch (err: any) {
        res.status(500).json({ success: false, message: "Failed to create review", error: err.message });
    }
}

export const getReviewsByProductId = async(req: AuthRequest, res: Response) => {
    const productId = Number(req.params.productId);

    try {
        const reviews = await getReviewsByProductIdService(productId);
        res.status(200).json({ success: true, reviews });
    } catch (err: any) {
        res.status(500).json({ success: false, message: "Failed to fetch reviews", error: err.message });
    }
}

export const updateReview = async(req: AuthRequest, res: Response)=>{
    const reviewId = Number(req.params.reviewId);
    const { rating, comment } = req.body;
    const userId = req.user!.userId;

    try {
        const review = await updateReviewService(reviewId, userId, rating, comment);
        res.status(200).json({ success: true, review });
    } catch (err: any) {
        res.status(500).json({ success: false, message: "Failed to update review", error: err.message });
    }

}

export const deleteReview = async(req: AuthRequest, res: Response)=>{
    const userId = req.user!.userId;
    const reviewId = Number(req.params.reviewId);

    try {
        const review = await deleteReviewService(reviewId, userId);
        res.status(200).json({ success: true, review });
    } catch (err: any) {
        res.status(500).json({ success: false, message: "Failed to delete review", error: err.message });
    }
}