import { avg, count, eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { scores, stations } from '~/db/schema';

class StationRepository {
  findAll = async () => {
    return await db.select().from(stations).orderBy(stations.order);
  };

  findAllWithStats = async () => {
    const rows = await db
      .select({
        id: stations.id,
        name: stations.name,
        description: stations.description,
        order: stations.order,
        isReward: stations.isReward,
        playerCount: count(scores.id),
        avgScore: avg(scores.score),
      })
      .from(stations)
      .leftJoin(scores, eq(stations.id, scores.stationId))
      .groupBy(stations.id)
      .orderBy(stations.order);

    return rows.map((r) => ({
      ...r,
      avgScore: r.avgScore ? Number(r.avgScore).toFixed(1) : '0',
      playerCount: Number(r.playerCount),
    }));
  };

  findById = async (id: string) => {
    const [station] = await db.select().from(stations).where(eq(stations.id, id));
    return station ?? null;
  };

  create = async (data: { name: string; description?: string | null; order: number; isReward?: boolean }) => {
    const id = crypto.randomUUID();
    await db.insert(stations).values({ id, ...data });
    return { id, ...data };
  };

  update = async (id: string, data: Partial<{ name: string; description: string | null; order: number; isReward: boolean }>) => {
    await db.update(stations).set(data).where(eq(stations.id, id));
  };

  delete = async (id: string) => {
    await db.delete(stations).where(eq(stations.id, id));
  };
}

export default new StationRepository();
