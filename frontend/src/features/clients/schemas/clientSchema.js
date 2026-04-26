import { z } from 'zod';

export const clientSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  apellidos: z.string()
    .min(1, 'Los apellidos son obligatorios')
    .max(100, 'Máximo 100 caracteres'),
  identificacion: z.string()
    .min(1, 'La identificación es obligatoria')
    .max(20, 'Máximo 20 caracteres'),
  celular: z.string()
    .min(1, 'El teléfono celular es obligatorio')
    .max(20, 'Máximo 20 caracteres'),
  otroTelefono: z.string()
    .min(1, 'El otro teléfono es obligatorio')
    .max(20, 'Máximo 20 caracteres'),
  direccion: z.string()
    .min(1, 'La dirección es obligatoria')
    .max(200, 'Máximo 200 caracteres'),
  fNacimiento: z.string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date <= new Date();
    }, 'La fecha de nacimiento no puede ser futura'),
  fAfiliacion: z.string()
    .min(1, 'La fecha de afiliación es obligatoria')
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date <= new Date();
    }, 'La fecha de afiliación no puede ser futura'),
  sexo: z.string().min(1, 'El género es obligatorio'),
  resennaPersonal: z.string()
    .max(200, 'Máximo 200 caracteres')
    .optional()
    .nullable(),
  imagen: z.string().optional().nullable(),
  interesFK: z.string().min(1, 'Debe seleccionar un interés'),
});
