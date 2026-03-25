import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for login attempts
 * 5 requests per minute
 */
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Demasiados intentos de login. Intenta de nuevo en 1 minuto.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * General API rate limiter
 * 100 requests per 15 minutes
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: 'Demasiadas peticiones. Intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});
