import { eq, sql } from 'drizzle-orm';

import { db } from '~/configs/db';
import { scores, stations, users } from '~/db/schema';

class PlayerRepository {
  getProgress = async (playerId: string) => {
    const allStations = await db
      .select({
        id: stations.id,
        name: stations.name,
        order: stations.order,
        isReward: stations.isReward,
      })
      .from(stations)
      .orderBy(stations.order);

    const playerScores = await db
      .select({
        stationId: scores.stationId,
        score: scores.score,
      })
      .from(scores)
      .where(eq(scores.playerId, playerId));

    const scoreMap = new Map(playerScores.map((s) => [s.stationId, s.score]));

    const stationProgress = allStations.map((station) => ({
      ...station,
      score: scoreMap.get(station.id) ?? null,
      completed: scoreMap.has(station.id),
    }));

    const totalScore = playerScores.reduce((sum, s) => sum + s.score, 0);
    const gameStations = allStations.filter((s) => !s.isReward);
    const completedCount = gameStations.filter((s) => scoreMap.has(s.id)).length;
    const allCompleted = completedCount === gameStations.length && gameStations.length > 0;

    return { stations: stationProgress, totalScore, completedCount, totalStations: gameStations.length, allCompleted };
  };

  getTotalScore = async (playerId: string) => {
    const [result] = await db
      .select({ total: sql<number>`COALESCE(SUM(${scores.score}), 0)` })
      .from(scores)
      .where(eq(scores.playerId, playerId));
    return result?.total ?? 0;
  };

  updateRewardStatus = async (playerId: string, status: string) => {
    await db.update(users).set({ rewardStatus: status as any }).where(eq(users.id, playerId));
  };
}

export default new PlayerRepository();
