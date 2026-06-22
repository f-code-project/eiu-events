import type { RewardStatus, RoleType } from '~/constants/enums';

export type UserType = {
  id: string;
  mssv: string;
  role: RoleType;
  rewardStatus: RewardStatus;
  createdAt: string;
};

export type LoginInput = {
  mssv: string;
  password: string;
};

export type RegisterInput = {
  mssv: string;
  password: string;
  confirmPassword: string;
};
