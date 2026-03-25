import { z } from 'zod';

export const createGoalSchema = z.object({
  type: z.enum(['DAILY', 'WEEKLY'], { errorMap: () => ({ message: 'El tipo debe ser DAILY o WEEKLY' }) }),
  targetMinutes: z.number().int().positive('El objetivo debe ser un número positivo'),
  startDate: z.string().datetime('Fecha inválida'),
});

export const updateGoalSchema = z.object({
  targetMinutes: z.number().int().positive('El objetivo debe ser un número positivo').optional(),
  active: z.boolean().optional(),
});
