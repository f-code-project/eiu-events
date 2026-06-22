export enum RoleType {
  ADMIN = 'ADMIN',
  STATION_STAFF = 'STATION_STAFF',
  PLAYER = 'PLAYER',
}

export enum RewardStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum TokenType {
  AccessToken = 'AccessToken',
  RefreshToken = 'RefreshToken',
}

export enum ExpiresInTokenType {
  AccessToken = 15 * 60,
  RefreshToken = 30 * 24 * 60 * 60,
}
