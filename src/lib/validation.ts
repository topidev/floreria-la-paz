// src/lib/validation.ts
// Archivo central para TODOS los schemas Zod de la aplicación
// Importa y re-exporta para facilitar imports como: import { loginSchema } from '@/lib/validation'

import { z } from 'zod';

// ── Auth ────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .regex(/[A-Z]/, { message: 'Debe contener al menos una mayúscula' })
    .regex(/[0-9]/, { message: 'Debe contener al menos un número' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// ── Productos (ejemplo para catálogo de flores) ────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(3, { message: 'El nombre del producto es requerido' }),
  description: z.string().min(10, { message: 'Describe el arreglo floral' }),
  price: z.number().positive({ message: 'El precio debe ser positivo' }).min(50, { message: 'Mínimo $50 MXN' }),
  stock: z.number().int().nonnegative({ message: 'Stock no puede ser negativo' }),
  category: z.enum(['cumpleaños', 'bodas', 'condolencias', 'suscripciones', 'ocasiones especiales']),
  images: z.array(z.string().url()).min(1, { message: 'Al menos una imagen requerida' }),
  // Puedes agregar más: variants, tags, etc.
});

export type ProductForm = z.infer<typeof productSchema>;

// ── Orden / Checkout (ejemplo básico) ───────────────────────────────────────
export const checkoutSchema = z.object({
  address: z.string().min(10, { message: 'Dirección completa requerida' }),
  phone: z.string().regex(/^\+52\d{10}$/, { message: 'Teléfono inválido (usa +52...)' }),
  notes: z.string().optional(),
  deliveryDate: z.date().min(new Date(), { message: 'La fecha debe ser futura' }),
});

// ── Exporta tipos útiles si quieres inferir en otros lugares ──────────────────
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type CheckoutForm = z.infer<typeof checkoutSchema>;

// Puedes agregar más schemas aquí a medida que avances (cuponSchema, reviewSchema, etc.)