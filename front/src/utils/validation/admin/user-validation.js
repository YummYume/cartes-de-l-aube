import { z } from 'zod';

export const userAdminValidation = z
  .object({
    password: z
      .string()
      .min(8, { message: 'A password must contain at least 8 characters.' })
      .max(40, { message: 'A password must contain at most 40 characters.' })
      .regex(/(?=.*[a-z])/, {
        message: 'A password must contain at least one lowercase letter.',
      })
      .regex(/(?=.*[A-Z])/, {
        message: 'A password must contain at least one uppercase letter.',
      })
      .regex(/(?=.*\d)/, { message: 'A password must contain at least one digit.' })
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    role: z.enum(['admin', 'user']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const userValidation = z
  .object({
    password: z
      .string()
      .min(8, { message: 'A password must contain at least 8 characters.' })
      .max(40, { message: 'A password must contain at most 40 characters.' })
      .regex(/(?=.*[a-z])/, {
        message: 'A password must contain at least one lowercase letter.',
      })
      .regex(/(?=.*[A-Z])/, {
        message: 'A password must contain at least one uppercase letter.',
      })
      .regex(/(?=.*\d)/, { message: 'A password must contain at least one digit.' })
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
