import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import { createReview, getReviewsByProductId, updateReview, deleteReview } from "../controllers/review.controller.js";

const router = express.Router();

router.use(protectRoute);

router.post("/:productId", createReview);
router.get("/:productId", getReviewsByProductId);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);