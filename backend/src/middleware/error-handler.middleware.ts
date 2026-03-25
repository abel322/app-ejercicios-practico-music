import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

interface ErrorResponse {
  error: string;
  details?: unknown;
}

/**
 * Global error handler middleware
 * Handles Zod validation errors, Prisma errors, and generic errors
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error for debugging (task 14.2)
  console.error('=== Error occurred ===');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Stack trace:', err.stack);
  console.error('=====================');

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errorResponse: ErrorResponse = {
      error: 'Error de validación',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    };
    res.status(400).json(errorResponse);
    return;
  }

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        // Unique constraint violation
        res.status(409).json({
          error: 'Ya existe un registro con estos datos',
        });
        return;
      case 'P2025':
        // Record not found
        res.status(404).json({
          error: 'Registro no encontrado',
        });
        return;
      case 'P2003':
        // Foreign key constraint violation
        res.status(400).json({
          error: 'Referencia inválida a otro registro',
        });
        return;
      case 'P2014':
        // Invalid ID
        res.status(400).json({
          error: 'ID inválido',
        });
        return;
      default:
        res.status(500).json({
          error: 'Error en la base de datos',
        });
        return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      error: 'Datos inválidos',
    });
    return;
  }

  // Handle generic errors
  const statusCode = (err as any).statusCode || (err.message === 'Credenciales inválidas' ? 401 : 500);
  const message = (process.env.NODE_ENV === 'development' || statusCode !== 500) ? err.message : 'Error interno del servidor';

  res.status(statusCode).json({
    error: message,
  });
};
