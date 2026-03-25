import { Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../types';
import { updateProfileSchema, updatePasswordSchema } from '../validation/user.validation';

export class UserController {
  /**
   * Get user profile
   * GET /api/users/profile
   */
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const user = await UserService.getProfile(req.user.userId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/users/profile
   */
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      // Validate request body
      const validatedData = updateProfileSchema.parse(req.body);

      // Update profile
      const user = await UserService.updateProfile(req.user.userId, validatedData);

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user password
   * PUT /api/users/password
   */
  static async updatePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      // Validate request body
      const validatedData = updatePasswordSchema.parse(req.body);

      // Update password
      const result = await UserService.updatePassword(
        req.user.userId,
        validatedData.currentPassword,
        validatedData.newPassword
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user statistics
   * GET /api/users/stats
   */
  static async getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }

      const stats = await UserService.getStats(req.user.userId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
