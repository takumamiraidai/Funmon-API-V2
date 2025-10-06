import { z } from 'zod';

export const createUserSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  funmons: z.array(z.string()),
  sub: z.array(z.string()),
});
