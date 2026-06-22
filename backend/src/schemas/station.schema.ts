import { z } from 'zod';

export const createStationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Tên trạm không được để trống!'),
    description: z.string().trim().nullable().optional(),
    order: z.number().int().min(1, 'Thứ tự phải lớn hơn 0!'),
    isReward: z.boolean().optional().default(false),
  }),
});

export const updateStationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Tên trạm không được để trống!').optional(),
    description: z.string().trim().nullable().optional(),
    order: z.number().int().min(1, 'Thứ tự phải lớn hơn 0!').optional(),
    isReward: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
