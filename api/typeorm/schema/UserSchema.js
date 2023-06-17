import { EntitySchema } from 'typeorm';
import { z } from 'zod';

import { User } from '../models/User.js';

export default new EntitySchema({
  name: 'User',
  target: User,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    username: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
    },
    image: {
      type: 'varchar',
    },
    orundum: {
      type: 'int',
    },
  },
});

/**
 * @param {object} user
 * @returns {object}
 */
export const userSigninValidation = (user) =>
  z
    .object({
      username: z.string().nonempty({ message: 'Please enter your username.' }),
      password: z.string().nonempty({ message: 'Please enter your password.' }),
    })
    .safeParse(user);

/**
 * @param {object} user
 * @returns {object}
 */
export const userSignupValidation = (user) =>
  z
    .object({
      username: z
        .string()
        .nonempty({ message: 'Please enter a username.' })
        .min(3, { message: 'Your username must contain at least 3 characters.' })
        .max(15, { message: 'Your username must contain at mist 5 characters.' }),
      password: z
        .string()
        .nonempty({ message: 'Please enter a password.' })
        .min(8, { message: 'Your password must contain at least 8 characters.' })
        .max(40, { message: 'Your password must contain at mist 40 characters.' })
        .regex(/(?=.*[a-z])/, {
          message: 'Your password must contain at least one lowercase letter.',
        })
        .regex(/(?=.*[A-Z])/, {
          message: 'Your password must contain at least one uppercase letter.',
        })
        .regex(/(?=.*\d)/, { message: 'Your password must contain at least one digit.' }),
      passwordConfirm: z.string().nonempty({ message: 'Please confirm your password.' }),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords don't match",
      path: ['passwordConfirm'],
    })
    .safeParse(user);
