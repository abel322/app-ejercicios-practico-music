import { Router } from 'express';
import { LevelController } from '../controllers/level.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All level routes require authentication
router.use(authenticateToken);

/**
 * GET /api/levels/current
 * Get current level and progress to next level
 */
router.get('/current', LevelController.getCurrentLevel);

/**
 * GET /api/levels/history
 * Get level history
 */
router.get('/history', LevelController.getLevelHistory);

export default router;
