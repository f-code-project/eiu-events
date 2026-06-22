import { and, eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { scores, stationStaff, users } from '~/db/schema';

class ScoreRepository {
  findByPlayerAndStation = async (playerId: string, stationId: string) => {
    const [result] = await db
      .select()
      .from(scores)
      .where(and(eq(scores.playerId, playerId), eq(scores.stationId, stationId)));
    return result ?? null;
  };

  findByStation = async (stationId: string) => {
    return await db
      .select({
        id: scores.id,
        playerId: scores.playerId,
        playerMssv: users.mssv,
        score: scores.score,
        createdAt: scores.createdAt,
      })
      .from(scores)
      .innerJoin(users, eq(scores.playerId, users.id))
      .where(eq(scores.stationId, stationId))
      .orderBy(scores.createdAt);
  };

  create = async (data: { playerId: string; stationId: string; score: number; staffId: string }) => {
    const id = crypto.randomUUID();
    await db.insert(scores).values({ id, ...data });
    return { id, ...data };
  };

  isStaffAssignedToStation = async (userId: string, stationId: string) => {
    const [result] = await db
      .select()
      .from(stationStaff)
      .where(and(eq(stationStaff.userId, userId), eq(stationStaff.stationId, stationId)));
    return !!result;
  };
}

export default new ScoreRepository();
