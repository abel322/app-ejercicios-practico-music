import { z } from 'zod';

export const createExerciseSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  bookId: z.string().uuid('ID de libro inválido'),
  pages: z.string().min(1, 'Las páginas son requeridas'),
  difficulty: z.enum(['BASIC', 'INTERMEDIATE', 'ADVANCED'], {
    errorMap: () => ({ message: 'Dificultad inválida' }),
  }),
  notes: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});

export const updateExerciseSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres').optional(),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  pages: z.string().min(1, 'Las páginas son requeridas').optional(),
  difficulty: z
    .enum(['BASIC', 'INTERMEDIATE', 'ADVANCED'], {
      errorMap: () => ({ message: 'Dificultad inválida' }),
    })
    .optional(),
  notes: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
});
