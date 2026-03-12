import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import { createReview, getReviewsByProductId, updateReview, deleteReview } from "../controllers/review.controller.js";

const router = express.Router();

// /v1/api/products 

router.get("/:productId/reviews", getReviewsByProductId);

router.use(protectRoute);

router.post("/:productId/reviews", createReview);
router.put("/reviews/:reviewId", updateReview);
router.delete("/reviews/:reviewId", deleteReview);

export default router;