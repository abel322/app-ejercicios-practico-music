import { Response, NextFunction } from 'express';
import { ExerciseService } from '../services/exercise.service';
import { AuthRequest } from '../types';
import { createExerciseSchema, updateExerciseSchema } from '../validation/exercise.validation';
import { Difficulty } from '@prisma/client';

export class ExerciseController {
  /**
   * Get all exercises
   * GET /api/exercises?bookId=...&difficulty=...&search=...
   */
  static async getExercises(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { bookId, difficulty, search } = req.query;

      const exercises = await ExerciseService.getExercises(req.user.userId, {
        bookId: bookId as string | undefined,
        difficulty: difficulty as Difficulty | undefined,
        search: search as string | undefined,
      });

      res.status(200).json({ exercises });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single exercise
   * GET /api/exercises/:id
   */
  static async getExercise(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;
      const exercise = await ExerciseService.getExercise(id, req.user.userId);

      res.status(200).json({ exercise });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new exercise
   * POST /api/exercises
   */
  static async createExercise(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      // Validate request body
      const validatedData = createExerciseSchema.parse(req.body);

      // Create exercise
      const exercise = await ExerciseService.createExercise(req.user.userId, validatedData);

      res.status(201).json({ exercise });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an exercise
   * PUT /api/exercises/:id
   */
  static async updateExercise(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;

      // Validate request body
      const validatedData = updateExerciseSchema.parse(req.body);

      // Update exercise
      const exercise = await ExerciseService.updateExercise(id, req.user.userId, validatedData);

      res.status(200).json({ exercise });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an exercise
   * DELETE /api/exercises/:id
   */
  static async deleteExercise(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;
      const result = await ExerciseService.deleteExercise(id, req.user.userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
