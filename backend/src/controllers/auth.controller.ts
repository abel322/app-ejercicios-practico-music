import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validation/auth.validation';

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body);

      // Register user
      const result = await AuthService.register(validatedData);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login a user
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);

      // Login user
      const result = await AuthService.login(validatedData.email, validatedData.password);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Forgot password - send reset email
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      // TODO: Implement email sending logic
      // For now, just return success message

      res.status(200).json({
        message: 'Si el email existe, recibirás un enlace de recuperación',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      // TODO: Implement password reset logic with token validation

      res.status(200).json({
        message: 'Contraseña actualizada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}
