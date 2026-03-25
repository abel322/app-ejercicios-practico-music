import { Response } from 'express';
import { AuthRequest } from '../types';
import { ExerciseProgressService } from '../services/exercise-progress.service';
import { ExerciseStatus } from '@prisma/client';

export class ExerciseProgressController {
  /**
   * GET /api/exercise-progress/:exerciseId
   * Get progress for a specific exercise
   */
  static async getProgress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { exerciseId } = req.params;
      const userId = req.user!.userId;

      const progress = await ExerciseProgressService.getProgress(userId, exerciseId);

      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener el progreso' });
    }
  }

  /**
   * GET /api/exercise-progress
   * Get all exercise progress for the user
   */
  static async getAllProgress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { status } = req.query;

      const validStatus = status as ExerciseStatus | undefined;

      const progressList = await ExerciseProgressService.getAllProgress(userId, validStatus);

      res.json(progressList);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener el progreso' });
    }
  }

  /**
   * POST /api/exercise-progress/:exerciseId
   * Update exercise progress after practice
   */
  static async updateProgress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { exerciseId } = req.params;
      const userId = req.user!.userId;
      const { tempo, durationSeconds } = req.body;

      if (!tempo || !durationSeconds) {
        res.status(400).json({ error: 'Tempo y duración son requeridos' });
        return;
      }

      const progress = await ExerciseProgressService.updateProgress(userId, exerciseId, {
        tempo,
        durationSeconds,
      });

      res.json(progress);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al actualizar el progreso' });
    }
  }

  /**
   * GET /api/exercise-progress/stats
   * Get progress statistics
   */
  static async getStatistics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;

      const stats = await ExerciseProgressService.getStatistics(userId);

      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al obtener estadísticas' });
    }
  }

  /**
   * DELETE /api/exercise-progress/:exerciseId
   * Reset exercise progress
   */
  static async resetProgress(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { exerciseId } = req.params;
      const userId = req.user!.userId;

      const result = await ExerciseProgressService.resetProgress(userId, exerciseId);

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error al reiniciar el progreso' });
    }
  }
}
