import type { RoleType } from '~/constants/enums';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: RoleType;
    }
  }
}
