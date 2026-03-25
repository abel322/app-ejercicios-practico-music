import { Router } from 'express';
import { PredictionController } from '../controllers/prediction.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/predictions/next-level - Get prediction for next level
router.get('/next-level', PredictionController.getNextLevelPrediction);

export default router;
