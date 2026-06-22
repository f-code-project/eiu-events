import { z } from 'zod';

export const createScoreSchema = z.object({
  body: z.object({
    mssv: z.string().trim().min(1, 'MSSV không được để trống!'),
    stationId: z.string().trim().min(1, 'Trạm không được để trống!'),
    score: z.number().int().min(1, 'Điểm tối thiểu là 1!').max(3, 'Điểm tối đa là 3!'),
  }),
});
