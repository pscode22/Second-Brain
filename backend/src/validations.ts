import { z } from 'zod';

export const signUpValidation = z.object({
  userName: z.string().trim().min(3).max(15),
  password: z.string().min(3).max(30),
});

export const signInValidation = z.object({
  userName: z.string().trim().min(3).max(15),
  password: z.string().trim().min(3).max(30),
});
