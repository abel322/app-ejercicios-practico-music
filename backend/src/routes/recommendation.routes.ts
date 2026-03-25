import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/recommendations - Get personalized recommendations
router.get('/', RecommendationController.getRecommendations);

export default router;
