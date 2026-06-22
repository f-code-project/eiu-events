import { and, eq, inArray } from 'drizzle-orm';

import { db } from '~/configs/db';
import { stationStaff, stations, users } from '~/db/schema';

import type { RoleType } from '~/constants/enums';

class StaffRepository {
  findAll = async () => {
    const staffUsers = await db
      .select({
        id: users.id,
        mssv: users.mssv,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.role, 'STATION_STAFF'));

    const staffWithStations = await Promise.all(
      staffUsers.map(async (staff) => {
        const assigned = await db
          .select({
            stationId: stationStaff.stationId,
            stationName: stations.name,
          })
          .from(stationStaff)
          .innerJoin(stations, eq(stationStaff.stationId, stations.id))
          .where(eq(stationStaff.userId, staff.id));

        return { ...staff, stations: assigned };
      }),
    );

    return staffWithStations;
  };

  findById = async (id: string) => {
    const [staff] = await db
      .select({
        id: users.id,
        mssv: users.mssv,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(and(eq(users.id, id), eq(users.role, 'STATION_STAFF')));

    if (!staff) return null;

    const assigned = await db
      .select({
        stationId: stationStaff.stationId,
        stationName: stations.name,
      })
      .from(stationStaff)
      .innerJoin(stations, eq(stationStaff.stationId, stations.id))
      .where(eq(stationStaff.userId, id));

    return { ...staff, stations: assigned };
  };

  createUser = async (data: { mssv: string; password: string; role: RoleType }) => {
    const id = crypto.randomUUID();
    await db.insert(users).values({ id, ...data });
    return id;
  };

  assignStations = async (userId: string, stationIds: string[]) => {
    if (stationIds.length === 0) return;
    const values = stationIds.map((stationId) => ({
      id: crypto.randomUUID(),
      userId,
      stationId,
    }));
    await db.insert(stationStaff).values(values);
  };

  removeStations = async (userId: string) => {
    await db.delete(stationStaff).where(eq(stationStaff.userId, userId));
  };

  updateUser = async (id: string, data: Partial<{ mssv: string; password: string }>) => {
    await db.update(users).set(data).where(eq(users.id, id));
  };

  deleteUser = async (id: string) => {
    await db.delete(stationStaff).where(eq(stationStaff.userId, id));
    await db.delete(users).where(eq(users.id, id));
  };

  findStationsByIds = async (ids: string[]) => {
    if (ids.length === 0) return [];
    return await db.select().from(stations).where(inArray(stations.id, ids));
  };
}

export default new StaffRepository();
