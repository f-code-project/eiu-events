import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { scores } from '~/db/schema';
import stationRepository from '~/repositories/station.repository';
import { ErrorWithStatus } from '~/rules/error';

class StationService {
  getAll = async () => {
    return await stationRepository.findAll();
  };

  getPublicStats = async () => {
    return await stationRepository.findAllWithStats();
  };

  getById = async (id: string) => {
    const station = await stationRepository.findById(id);
    if (!station) {
      throw new ErrorWithStatus({
        message: 'Trạm không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }
    return station;
  };

  create = async (data: { name: string; description?: string | null; order: number; isReward?: boolean }) => {
    return await stationRepository.create(data);
  };

  update = async (id: string, data: Partial<{ name: string; description: string | null; order: number; isReward: boolean }>) => {
    await this.getById(id);
    await stationRepository.update(id, data);
  };

  delete = async (id: string) => {
    await this.getById(id);

    const [existingScore] = await db.select().from(scores).where(eq(scores.stationId, id)).limit(1);
    if (existingScore) {
      throw new ErrorWithStatus({
        message: 'Không thể xoá trạm đã có điểm!',
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    await stationRepository.delete(id);
  };
}

export default new StationService();
