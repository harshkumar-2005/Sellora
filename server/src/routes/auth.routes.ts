import express from "express";
import { signup, login, getme, refresh, logout } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// /v1/api/auth

router.post('/signup', signup);

router.post('/login', login);

router.post('/getme', protectRoute, getme);

router.post('/refresh', protectRoute, refresh);

router.post('/logout', protectRoute, logout);

export default router;