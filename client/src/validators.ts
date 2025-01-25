import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long').nonempty('Username is required'),
  email: z.string().email('Invalid email format').nonempty('Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long').nonempty('Password is required'),
  confirmPassword: z.string()
    .nonempty('Confirm Password is required')
});
