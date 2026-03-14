import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otp.controller.js";

const router = express.Router();

// /v1/api/otp

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);

export default router;