import { z } from 'zod';

export const updateScoreSchema = z.object({
  body: z.object({
    score: z.number().int().min(1, 'Điểm tối thiểu là 1!').max(3, 'Điểm tối đa là 3!'),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
