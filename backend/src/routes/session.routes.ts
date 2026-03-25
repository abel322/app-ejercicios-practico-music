import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All session routes require authentication
router.use(authenticateToken);

/**
 * GET /api/sessions
 * Get all sessions with optional filters and pagination
 */
router.get('/', SessionController.getSessions);

/**
 * POST /api/sessions
 * Create a new session
 */
router.post('/', SessionController.createSession);

/**
 * GET /api/sessions/:id
 * Get a single session by ID
 */
router.get('/:id', SessionController.getSession);

/**
 * PUT /api/sessions/:id
 * Update a session (only within 24 hours)
 */
router.put('/:id', SessionController.updateSession);

/**
 * DELETE /api/sessions/:id
 * Delete a session
 */
router.delete('/:id', SessionController.deleteSession);

export default router;
