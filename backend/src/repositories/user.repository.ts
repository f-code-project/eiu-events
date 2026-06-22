import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { users } from '~/db/schema';

import type { RoleType } from '~/constants/enums';

class UserRepository {
  findByMssv = async (mssv: string) => {
    const [user] = await db.select().from(users).where(eq(users.mssv, mssv));
    return user ?? null;
  };

  findById = async (id: string) => {
    const [user] = await db
      .select({
        id: users.id,
        mssv: users.mssv,
        role: users.role,
        rewardStatus: users.rewardStatus,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id));
    return user ?? null;
  };

  findByIdWithPassword = async (id: string) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  };

  create = async (data: { mssv: string; password: string; role: RoleType }) => {
    const id = crypto.randomUUID();
    await db.insert(users).values({ id, ...data });
    return { id, mssv: data.mssv, role: data.role };
  };
}

export default new UserRepository();
