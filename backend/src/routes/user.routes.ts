import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

/**
 * GET /api/users/profile
 * Get user profile
 */
router.get('/profile', UserController.getProfile);

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', UserController.updateProfile);

/**
 * PUT /api/users/password
 * Update user password
 */
router.put('/password', UserController.updatePassword);

/**
 * GET /api/users/stats
 * Get user statistics
 */
router.get('/stats', UserController.getStats);

export default router;
