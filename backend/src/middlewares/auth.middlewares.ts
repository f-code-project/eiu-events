import type { NextFunction, Request, Response } from 'express';

import { RoleType, TokenType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ErrorWithStatus } from '~/rules/error';
import { AlgoJwt } from '~/utils/jwt';

class MiddlewareAuth {
  auth = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.access_token;
      if (!token) {
        throw new ErrorWithStatus({
          message: 'Token không được cung cấp!',
          status: HTTP_STATUS.UNAUTHORIZED,
        });
      }

      const payload = await AlgoJwt.verifyToken(token);

      if (payload.type !== TokenType.AccessToken) {
        throw new ErrorWithStatus({
          message: 'Token không hợp lệ!',
          status: HTTP_STATUS.UNAUTHORIZED,
        });
      }

      req.userId = payload.userId;
      req.role = payload.role as RoleType;
      next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return next(
          new ErrorWithStatus({
            message: 'Token đã hết hạn!',
            status: HTTP_STATUS.UNAUTHORIZED,
          }),
        );
      }
      if (err.name === 'JsonWebTokenError') {
        return next(
          new ErrorWithStatus({
            message: 'Token không hợp lệ!',
            status: HTTP_STATUS.UNAUTHORIZED,
          }),
        );
      }
      next(err);
    }
  };
}

export const middlewareAuth = new MiddlewareAuth();

export const isRole = (roles: RoleType[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return next(
        new ErrorWithStatus({
          message: 'Bạn không có quyền truy cập!',
          status: HTTP_STATUS.FORBIDDEN,
        }),
      );
    }
    next();
  };
};
