import type { NextFunction, Request, Response } from 'express';

import { env } from '~/configs/env';
import { ExpiresInTokenType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import authService from '~/services/auth.service';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('access_token', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ExpiresInTokenType.RefreshToken * 1000,
  });
  res.cookie('refresh_token', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: ExpiresInTokenType.RefreshToken * 1000,
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie('access_token', COOKIE_OPTIONS);
  res.clearCookie('refresh_token', COOKIE_OPTIONS);
}

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.status(HTTP_STATUS.CREATED).json(
        new ResponseClient({ message: 'Đăng ký thành công!', result }),
      );
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken, ...user } = await authService.login(req.body);
      setAuthCookies(res, accessToken, refreshToken);
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({ message: 'Đăng nhập thành công!', result: user }),
      );
    } catch (err) {
      next(err);
    }
  };

  getInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.getInfo(req.userId!);
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({ message: 'Thành công!', result }),
      );
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentRefreshToken = req.cookies.refresh_token;
      const { accessToken, refreshToken } = await authService.refreshToken(currentRefreshToken);
      setAuthCookies(res, accessToken, refreshToken);
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({ message: 'Làm mới token thành công!' }),
      );
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.logout(req.userId!);
      clearAuthCookies(res);
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({ message: 'Đăng xuất thành công!' }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
