import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types';

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Token no proporcionado' });
    return;
  }

  try {
    const payload = AuthService.verifyToken(token);
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
    return;
  }
};
