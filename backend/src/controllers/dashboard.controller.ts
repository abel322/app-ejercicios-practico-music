import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  /**
   * GET /api/dashboard/stats?instrument=PIANO
   * Get general statistics
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { startDate, endDate, instrument } = req.query;

      const stats = await DashboardService.getStats(userId, {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        instrument: instrument as string | undefined,
      });

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/practice-chart?instrument=PIANO
   * Get practice chart data for last N days
   */
  static async getPracticeChart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { startDate, endDate, instrument } = req.query;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;

      const chartData = await DashboardService.getPracticeChart(userId, days, {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        instrument: instrument as string | undefined,
      });

      res.json(chartData);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/instrument-distribution
   * Get instrument distribution
   */
  static async getInstrumentDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { startDate, endDate } = req.query;

      const distribution = await DashboardService.getInstrumentDistribution(userId, {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
      });

      res.json(distribution);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/dashboard/top-exercises?instrument=PIANO
   * Get top exercises by practice time
   */
  static async getTopExercises(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { startDate, endDate, instrument } = req.query;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

      const topExercises = await DashboardService.getTopExercises(userId, limit, {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        instrument: instrument as string | undefined,
      });

      res.json(topExercises);
    } catch (error) {
      next(error);
    }
  }
}
