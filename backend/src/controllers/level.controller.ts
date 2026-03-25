import { Response, NextFunction } from 'express';
import { LevelService } from '../services/level.service';
import { AuthRequest } from '../types';

export class LevelController {
  /**
   * Get current level and progress
   * GET /api/levels/current?instrument=PIANO
   */
  static async getCurrentLevel(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const instrument = req.query.instrument as string | undefined;
      const result = await LevelService.getCurrentLevel(req.user.userId, instrument);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get level history
   * GET /api/levels/history?instrument=PIANO
   */
  static async getLevelHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const instrument = req.query.instrument as string | undefined;
      const history = await LevelService.getLevelHistory(req.user.userId, instrument);
      res.status(200).json({ history });
    } catch (error) {
      next(error);
    }
  }
}
