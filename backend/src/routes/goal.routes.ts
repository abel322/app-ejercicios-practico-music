import { Router } from 'express';
import { GoalController } from '../controllers/goal.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All goal routes require authentication
router.use(authenticateToken);

/**
 * GET /api/goals
 * Get all goals with optional filter by active status
 */
router.get('/', GoalController.getGoals);

/**
 * POST /api/goals
 * Create a new goal
 */
router.post('/', GoalController.createGoal);

/**
 * GET /api/goals/:id
 * Get a single goal by ID with current progress
 */
router.get('/:id', GoalController.getGoal);

/**
 * PUT /api/goals/:id
 * Update a goal
 */
router.put('/:id', GoalController.updateGoal);

/**
 * DELETE /api/goals/:id
 * Delete a goal
 */
router.delete('/:id', GoalController.deleteGoal);

export default router;
