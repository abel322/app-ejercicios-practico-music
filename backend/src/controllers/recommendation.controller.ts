import { Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { AuthRequest } from '../types';

export class RecommendationController {
  /**
   * Get personalized recommendations for the authenticated user
   * GET /api/recommendations
   */
  static async getRecommendations(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const recommendations = await RecommendationService.generateRecommendations(
        req.user.userId
      );

      res.status(200).json({ recommendations });
    } catch (error) {
      next(error);
    }
  }
}
