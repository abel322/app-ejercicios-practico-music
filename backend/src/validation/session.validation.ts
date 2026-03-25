import { z } from 'zod';

export const createSessionSchema = z.object({
  date: z.string().datetime('Fecha inválida'),
  durationMinutes: z.number().int().positive('La duración debe ser positiva'),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().uuid('ID de ejercicio inválido'),
        durationMinutes: z.number().int().positive('La duración debe ser positiva'),
      })
    )
    .min(0, 'Debe incluir al menos un ejercicio o dejar vacío'),
  notes: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});

export const updateSessionSchema = z.object({
  durationMinutes: z.number().int().positive('La duración debe ser positiva').optional(),
  exercises: z
    .array(
      z.object({
        exerciseId: z.string().uuid('ID de ejercicio inválido'),
        durationMinutes: z.number().int().positive('La duración debe ser positiva'),
      })
    )
    .optional(),
  notes: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});
