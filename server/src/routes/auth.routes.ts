import express from "express";
import { signup, login, profile, refresh, logout, resetPassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// /v1/api/auth

router.post('/signup', signup);

router.post('/login', login);

router.get('/profile', protectRoute, profile);

router.post('/refresh', protectRoute, refresh);

router.delete('/logout', protectRoute, logout);

router.patch('/reset-password', resetPassword);

export default router;
