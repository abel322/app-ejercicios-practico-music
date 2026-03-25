import { Router } from 'express';
import { ExerciseProgressController } from '../controllers/exercise-progress.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/exercise-progress/stats
 * Get progress statistics
 */
router.get('/stats', ExerciseProgressController.getStatistics);

/**
 * GET /api/exercise-progress
 * Get all exercise progress
 */
router.get('/', ExerciseProgressController.getAllProgress);

/**
 * GET /api/exercise-progress/:exerciseId
 * Get progress for a specific exercise
 */
router.get('/:exerciseId', ExerciseProgressController.getProgress);

/**
 * POST /api/exercise-progress/:exerciseId
 * Update exercise progress
 */
router.post('/:exerciseId', ExerciseProgressController.updateProgress);

/**
 * DELETE /api/exercise-progress/:exerciseId
 * Reset exercise progress
 */
router.delete('/:exerciseId', ExerciseProgressController.resetProgress);

export default router;
