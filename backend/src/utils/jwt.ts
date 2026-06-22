import jwt from 'jsonwebtoken';

import { env } from '~/configs/env';

export type TokenPayload = {
  userId: string;
  role: string;
  type: string;
  iat?: number;
  exp?: number;
};

export class AlgoJwt {
  static signToken({ payload, options }: { payload: object; options: jwt.SignOptions }): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, env.JWT_SECRET, { algorithm: 'HS256', ...options }, (err, token) => {
        if (err || !token) return reject(err);
        resolve(token);
      });
    });
  }

  static verifyToken(token: string, options?: jwt.VerifyOptions): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, options ?? {}, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as TokenPayload);
      });
    });
  }
}
