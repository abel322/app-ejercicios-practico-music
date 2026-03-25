import { Response, NextFunction } from 'express';
import { GoalService } from '../services/goal.service';
import { AuthRequest } from '../types';
import { createGoalSchema, updateGoalSchema } from '../validation/goal.validation';

export class GoalController {
  /**
   * Get all goals
   * GET /api/goals?active=true&instrument=PIANO
   */
  static async getGoals(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { active, instrument } = req.query;
      const activeOnly = active === 'true' ? true : active === 'false' ? false : undefined;

      const goals = await GoalService.getGoals(req.user.userId, activeOnly, instrument as string | undefined);

      res.status(200).json({ goals });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single goal with progress
   * GET /api/goals/:id
   */
  static async getGoal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;
      const result = await GoalService.getGoal(id, req.user.userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new goal
   * POST /api/goals
   */
  static async createGoal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      // Validate request body
      const validatedData = createGoalSchema.parse(req.body);

      // Create goal
      const goal = await GoalService.createGoal(req.user.userId, validatedData);

      res.status(201).json({ goal });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a goal
   * PUT /api/goals/:id
   */
  static async updateGoal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;

      // Validate request body
      const validatedData = updateGoalSchema.parse(req.body);

      // Update goal
      const goal = await GoalService.updateGoal(id, req.user.userId, validatedData);

      res.status(200).json({ goal });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a goal
   * DELETE /api/goals/:id
   */
  static async deleteGoal(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;
      const result = await GoalService.deleteGoal(id, req.user.userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
