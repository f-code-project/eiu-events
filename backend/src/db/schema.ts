import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core';

// ── Users ──────────────────────────────────────────────
export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  mssv: varchar('mssv', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['ADMIN', 'STATION_STAFF', 'PLAYER']).notNull().default('PLAYER'),
  rewardStatus: mysqlEnum('reward_status', ['NONE', 'PENDING', 'COMPLETED']).notNull().default('NONE'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Stations ───────────────────────────────────────────
export const stations = mysqlTable('stations', {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  order: int('order').notNull(),
  isReward: boolean('is_reward').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── Station Staff (many-to-many: user ↔ station) ──────
export const stationStaff = mysqlTable(
  'station_staff',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id),
    stationId: varchar('station_id', { length: 36 })
      .notNull()
      .references(() => stations.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('staff_station_idx').on(table.userId, table.stationId)],
);

// ── Scores ─────────────────────────────────────────────
export const scores = mysqlTable(
  'scores',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    playerId: varchar('player_id', { length: 36 })
      .notNull()
      .references(() => users.id),
    stationId: varchar('station_id', { length: 36 })
      .notNull()
      .references(() => stations.id),
    score: int('score').notNull(),
    staffId: varchar('staff_id', { length: 36 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('player_station_idx').on(table.playerId, table.stationId),
    index('station_idx').on(table.stationId),
  ],
);

// ── Reward Requests ────────────────────────────────────
export const rewardRequests = mysqlTable(
  'reward_requests',
  {
    id: varchar('id', { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    playerId: varchar('player_id', { length: 36 })
      .notNull()
      .references(() => users.id),
    status: mysqlEnum('status', ['PENDING', 'COMPLETED']).notNull().default('PENDING'),
    processedBy: varchar('processed_by', { length: 36 }).references(() => users.id),
    totalScore: int('total_score').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    processedAt: timestamp('processed_at'),
  },
  (table) => [index('player_reward_idx').on(table.playerId)],
);
