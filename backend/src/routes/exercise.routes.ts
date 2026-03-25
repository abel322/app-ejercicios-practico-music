import { Router } from 'express';
import { ExerciseController } from '../controllers/exercise.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All exercise routes require authentication
router.use(authenticateToken);

/**
 * GET /api/exercises
 * Get all exercises with optional filters
 */
router.get('/', ExerciseController.getExercises);

/**
 * POST /api/exercises
 * Create a new exercise
 */
router.post('/', ExerciseController.createExercise);

/**
 * GET /api/exercises/:id
 * Get a single exercise by ID
 */
router.get('/:id', ExerciseController.getExercise);

/**
 * PUT /api/exercises/:id
 * Update an exercise
 */
router.put('/:id', ExerciseController.updateExercise);

/**
 * DELETE /api/exercises/:id
 * Delete an exercise
 */
router.delete('/:id', ExerciseController.deleteExercise);

export default router;
