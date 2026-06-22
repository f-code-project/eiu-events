import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ErrorWithStatus } from '~/rules/error';

export const defaultErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    const { message, status, ...rest } = err;
    res.status(status).json({ status: false, message, ...rest });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: false,
    message: 'Lỗi hệ thống!',
  });
};
