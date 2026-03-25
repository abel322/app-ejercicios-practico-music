import { Router } from 'express';
import { ExportController } from '../controllers/export.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/export/data - Export all user data as JSON
router.get('/data', ExportController.exportData);

// GET /api/export/stats?format=csv - Export statistics as CSV
router.get('/stats', ExportController.exportStats);

export default router;
