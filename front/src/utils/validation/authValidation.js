import { z } from 'zod';

export const loginValidation = z.object({
  username: z.string().nonempty({ message: 'Please enter your username.' }),
  password: z.string().nonempty({ message: 'Please enter your password.' }),
});

export const registerValidation = z
  .object({
    username: z
      .string()
      .nonempty({ message: 'Please enter a username.' })
      .min(3, { message: 'Your username must contain at least 3 characters.' })
      .max(15, { message: 'Your username must contain at most 15 characters.' }),
    password: z
      .string()
      .nonempty({ message: 'Please enter a password.' })
      .min(8, { message: 'Your password must contain at least 8 characters.' })
      .max(40, { message: 'Your password must contain at most 40 characters.' })
      .regex(/(?=.*[a-z])/, {
        message: 'Your password must contain at least one lowercase letter.',
      })
      .regex(/(?=.*[A-Z])/, {
        message: 'Your password must contain at least one uppercase letter.',
      })
      .regex(/(?=.*\d)/, { message: 'Your password must contain at least one digit.' }),
    confirmPassword: z.string().nonempty({ message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
