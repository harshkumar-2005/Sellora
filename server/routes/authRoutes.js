import express from 'express';
import { signup, login, getme } from '../controllers/authcontroller.js';
import { isAuthenticated } from '../middlewares/jwtMiddleware.js';

const router = express.Router();

// /v1/api/auth
router.post('/signup', signup);

router.post('/login', login);

router.get('/me', isAuthenticated, getme);

export default router;