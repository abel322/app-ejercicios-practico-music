import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  instruments: z
    .array(z.enum(['PIANO', 'BASS', 'DRUMS', 'GUITAR']))
    .min(1, 'Selecciona al menos un instrumento')
    .optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
});
