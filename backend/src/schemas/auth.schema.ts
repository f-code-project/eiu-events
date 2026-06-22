import { z } from 'zod';

export const registerSchema = z.object({
  body: z
    .object({
      mssv: z.string().trim().min(1, 'MSSV không được để trống!'),
      password: z.string().trim().min(6, 'Mật khẩu phải có ít nhất 6 ký tự!'),
      confirmPassword: z.string().trim().min(1, 'Xác nhận mật khẩu không được để trống!'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp!',
      path: ['confirmPassword'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    mssv: z.string().trim().min(1, 'MSSV không được để trống!'),
    password: z.string().trim().min(1, 'Mật khẩu không được để trống!'),
  }),
});
