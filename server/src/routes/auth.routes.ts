import express from "express";

import { signup, login, getme } from "../controllers/auth.controller.js";


const router = express.Router();

// /v1/api/auth

router.get('/signup', signup);

router.get('/login', login);

router.get('/getme', getme);

export default router;