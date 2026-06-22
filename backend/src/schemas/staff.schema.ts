import { z } from 'zod';

export const createStaffSchema = z.object({
  body: z.object({
    mssv: z.string().trim().min(1, 'MSSV không được để trống!'),
    password: z.string().trim().min(6, 'Mật khẩu phải có ít nhất 6 ký tự!'),
    stationIds: z.array(z.string().min(1)).min(1, 'Phải chọn ít nhất 1 trạm!'),
  }),
});

export const updateStaffSchema = z.object({
  body: z.object({
    mssv: z.string().trim().min(1, 'MSSV không được để trống!').optional(),
    password: z.string().trim().min(6, 'Mật khẩu phải có ít nhất 6 ký tự!').optional(),
    stationIds: z.array(z.string().min(1)).min(1, 'Phải chọn ít nhất 1 trạm!').optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});
