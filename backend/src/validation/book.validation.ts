import { z } from 'zod';

export const createBookSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres'),
  instrument: z.enum(['PIANO', 'BASS', 'DRUMS', 'GUITAR'], {
    errorMap: () => ({ message: 'Instrumento inválido' }),
  }),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});

export const updateBookSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200, 'Máximo 200 caracteres').optional(),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
});
