import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/dashboard/stats - Get general statistics
router.get('/stats', DashboardController.getStats);

// GET /api/dashboard/practice-chart - Get practice chart data
router.get('/practice-chart', DashboardController.getPracticeChart);

// GET /api/dashboard/instrument-distribution - Get instrument distribution
router.get('/instrument-distribution', DashboardController.getInstrumentDistribution);

// GET /api/dashboard/top-exercises - Get top exercises
router.get('/top-exercises', DashboardController.getTopExercises);

export default router;
