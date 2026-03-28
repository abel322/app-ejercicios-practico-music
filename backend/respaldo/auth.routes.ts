import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { loginLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', AuthController.register);

/**
 * POST /api/auth/login
 * Login a user
 */
router.post('/login', loginLimiter, AuthController.login);

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', AuthController.forgotPassword);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', AuthController.resetPassword);

export default router;
