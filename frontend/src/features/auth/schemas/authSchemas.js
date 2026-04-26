import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .nonempty('El nombre de usuario es obligatorio')
    .min(3, 'Debe tener al menos 3 caracteres'),

  email: z
    .string()
    .trim()
    .nonempty('El correo electrónico es obligatorio')
    .email('Correo electrónico inválido'),

  password: z
    .string()
    .nonempty('La contraseña es obligatoria')
    .min(8, 'Debe tener mínimo 8 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/[A-Z]/, 'Debe incluir una mayúscula')
    .regex(/[a-z]/, 'Debe incluir una minúscula')
    .regex(/[0-9]/, 'Debe incluir un número')
});

export const loginSchema = z.object({
  username: z.string().trim().nonempty('El usuario es obligatorio'),
  password: z.string().nonempty('La contraseña es obligatoria')
});
