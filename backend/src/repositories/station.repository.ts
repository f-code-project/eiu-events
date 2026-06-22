import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { stations } from '~/db/schema';

class StationRepository {
  findAll = async () => {
    return await db.select().from(stations).orderBy(stations.order);
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
