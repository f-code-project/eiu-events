import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { rewardRequests, users } from '~/db/schema';

class RewardRepository {
  create = async (data: { playerId: string; totalScore: number }) => {
    const id = crypto.randomUUID();
    await db.insert(rewardRequests).values({ id, ...data });
    return { id, ...data, status: 'PENDING' as const };
  };

  findPending = async () => {
    return await db
      .select({
        id: rewardRequests.id,
        playerId: rewardRequests.playerId,
        playerMssv: users.mssv,
        totalScore: rewardRequests.totalScore,
        status: rewardRequests.status,
        createdAt: rewardRequests.createdAt,
      })
      .from(rewardRequests)
      .innerJoin(users, eq(rewardRequests.playerId, users.id))
      .where(eq(rewardRequests.status, 'PENDING'))
      .orderBy(rewardRequests.createdAt);
  };

  findById = async (id: string) => {
    const [result] = await db.select().from(rewardRequests).where(eq(rewardRequests.id, id));
    return result ?? null;
  };

  complete = async (id: string, processedBy: string) => {
    await db
      .update(rewardRequests)
      .set({ status: 'COMPLETED', processedBy, processedAt: new Date() })
      .where(eq(rewardRequests.id, id));
  };
}

export default new RewardRepository();
