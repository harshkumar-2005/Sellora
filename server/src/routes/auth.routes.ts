import express from "express";
import { signup, login, getme } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// /v1/api/auth

router.post('/signup', signup);

router.post('/login', login);

router.post('/getme', protectRoute, getme);

export default router;