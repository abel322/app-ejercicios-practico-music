import { Response, NextFunction } from 'express';
import { SessionService } from '../services/session.service';
import { AuthRequest } from '../types';
import { createSessionSchema, updateSessionSchema } from '../validation/session.validation';

export class SessionController {
  /**
   * Get all sessions
   * GET /api/sessions?startDate=...&endDate=...&limit=...&offset=...
   */
  static async getSessions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { startDate, endDate, limit, offset } = req.query;

      const result = await SessionService.getSessions(req.user.userId, {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single session
   * GET /api/sessions/:id
   */
  static async getSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;
      const session = await SessionService.getSession(id, req.user.userId);

      res.status(200).json({ session });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new session
   * POST /api/sessions
   */
  static async createSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      // Validate request body
      const validatedData = createSessionSchema.parse(req.body);

      // Create session
      const result = await SessionService.createSession(req.user.userId, validatedData);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a session
   * PUT /api/sessions/:id
   */
  static async updateSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;

      // Validate request body
      const validatedData = updateSessionSchema.parse(req.body);

      // Update session
      const session = await SessionService.updateSession(id, req.user.userId, validatedData);

      res.status(200).json({ session });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a session
   * DELETE /api/sessions/:id
   */
  static async deleteSession(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const { id } = req.params;
      const result = await SessionService.deleteSession(id, req.user.userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
