export const RoleType = {
  ADMIN: 'ADMIN',
  STATION_STAFF: 'STATION_STAFF',
  PLAYER: 'PLAYER',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const RewardStatus = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
} as const;

export type RewardStatus = (typeof RewardStatus)[keyof typeof RewardStatus];
