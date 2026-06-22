import { eq, sql, count } from 'drizzle-orm';

import { db } from '~/configs/db';
import { rewardRequests, scores, stations, users } from '~/db/schema';

class AdminRepository {
  getDashboardStats = async () => {
    const [playerCount] = await db
      .select({ total: count() })
      .from(users)
      .where(eq(users.role, 'PLAYER'));

    const allStations = await db.select().from(stations).orderBy(stations.order);

    const stationStats = await Promise.all(
      allStations.map(async (station) => {
        const [stats] = await db
          .select({
            completedCount: count(),
            avgScore: sql<number>`COALESCE(AVG(${scores.score}), 0)`,
          })
          .from(scores)
          .where(eq(scores.stationId, station.id));

        return {
          stationId: station.id,
          stationName: station.name,
          order: station.order,
          isReward: station.isReward,
          completedCount: stats?.completedCount ?? 0,
          avgScore: Number(Number(stats?.avgScore ?? 0).toFixed(1)),
        };
      }),
    );

    const gameStationIds = allStations.filter((s) => !s.isReward).map((s) => s.id);
    const gameStationCount = gameStationIds.length;

    let completedAllStations = 0;
    if (gameStationCount > 0) {
      const [result] = await db
        .select({ total: count() })
        .from(
          db
            .select({ playerId: scores.playerId, stationCount: count().as('sc') })
            .from(scores)
            .where(sql`${scores.stationId} IN ${gameStationIds}`)
            .groupBy(scores.playerId)
            .having(sql`COUNT(*) = ${gameStationCount}`)
            .as('completed_players'),
        );
      completedAllStations = result?.total ?? 0;
    }

    const [rewardPending] = await db
      .select({ total: count() })
      .from(rewardRequests)
      .where(eq(rewardRequests.status, 'PENDING'));

    const [rewardCompleted] = await db
      .select({ total: count() })
      .from(rewardRequests)
      .where(eq(rewardRequests.status, 'COMPLETED'));

    return {
      totalPlayers: playerCount?.total ?? 0,
      totalStations: allStations.length,
      stationStats,
      completedAllStations,
      rewardStats: {
        pending: rewardPending?.total ?? 0,
        completed: rewardCompleted?.total ?? 0,
      },
    };
  };

  getPlayers = async () => {
    const players = await db
      .select({
        id: users.id,
        mssv: users.mssv,
        rewardStatus: users.rewardStatus,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, 'PLAYER'))
      .orderBy(users.createdAt);

    return await Promise.all(
      players.map(async (player) => {
        const playerScores = await db
          .select({
            stationId: scores.stationId,
            stationName: stations.name,
            score: scores.score,
          })
          .from(scores)
          .innerJoin(stations, eq(scores.stationId, stations.id))
          .where(eq(scores.playerId, player.id));

        const totalScore = playerScores.reduce((sum, s) => sum + s.score, 0);

        return { ...player, scores: playerScores, totalScore, completedStations: playerScores.length };
      }),
    );
  };

  getPlayerById = async (playerId: string) => {
    const [player] = await db
      .select({
        id: users.id,
        mssv: users.mssv,
        rewardStatus: users.rewardStatus,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, playerId));

    if (!player) return null;

    const playerScores = await db
      .select({
        id: scores.id,
        stationId: scores.stationId,
        stationName: stations.name,
        score: scores.score,
        staffMssv: users.mssv,
        createdAt: scores.createdAt,
      })
      .from(scores)
      .innerJoin(stations, eq(scores.stationId, stations.id))
      .innerJoin(users, eq(scores.staffId, users.id))
      .where(eq(scores.playerId, playerId));

    const totalScore = playerScores.reduce((sum, s) => sum + s.score, 0);

    return { ...player, scores: playerScores, totalScore };
  };

  updateScore = async (scoreId: string, score: number) => {
    await db.update(scores).set({ score }).where(eq(scores.id, scoreId));
  };

  deleteScore = async (scoreId: string) => {
    await db.delete(scores).where(eq(scores.id, scoreId));
  };

  findScoreById = async (scoreId: string) => {
    const [result] = await db.select().from(scores).where(eq(scores.id, scoreId));
    return result ?? null;
  };
}

export default new AdminRepository();
