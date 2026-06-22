import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

import { HTTP_STATUS } from '~/constants/httpStatus';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));

    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      status: false,
      message: 'Dữ liệu không hợp lệ!',
      errors,
    });
    return;
  }

  next();
};
