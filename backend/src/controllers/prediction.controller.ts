import { Request, Response, NextFunction } from 'express';
import { PredictionService } from '../services/prediction.service';

export class PredictionController {
  /**
   * Get next level prediction
   * GET /api/predictions/next-level?instrument=PIANO
   */
  static async getNextLevelPrediction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const instrument = req.query.instrument as string | undefined;

      const prediction = await PredictionService.predictNextLevel(userId, instrument);

      // Return response with prediction and insufficientData flag
      if (!prediction) {
        return res.json({
          prediction: null,
          insufficientData: true,
        });
      }

      res.json({
        prediction: {
          nextLevel: prediction.nextLevel,
          estimatedDate: prediction.estimatedDate,
          scenarios: prediction.scenarios,
        },
        insufficientData: false,
      });
    } catch (error) {
      next(error);
    }
  }
}
