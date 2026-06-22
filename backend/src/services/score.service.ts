import { RoleType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import scoreRepository from '~/repositories/score.repository';
import userRepository from '~/repositories/user.repository';
import { ErrorWithStatus } from '~/rules/error';

class ScoreService {
  getMyStations = async (staffId: string) => {
    const { db } = await import('~/configs/db');
    const { stationStaff, stations } = await import('~/db/schema');
    const { eq } = await import('drizzle-orm');

    return await db
      .select({
        stationId: stationStaff.stationId,
        stationName: stations.name,
        isReward: stations.isReward,
      })
      .from(stationStaff)
      .innerJoin(stations, eq(stationStaff.stationId, stations.id))
      .where(eq(stationStaff.userId, staffId));
  };

  create = async (staffId: string, data: { mssv: string; stationId: string; score: number }) => {
    const isAssigned = await scoreRepository.isStaffAssignedToStation(staffId, data.stationId);
    if (!isAssigned) {
      throw new ErrorWithStatus({
        message: 'Bạn không có quyền chấm điểm tại trạm này!',
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    const player = await userRepository.findByMssv(data.mssv);
    if (!player || player.role !== RoleType.PLAYER) {
      throw new ErrorWithStatus({
        message: 'Không tìm thấy người chơi!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    const existing = await scoreRepository.findByPlayerAndStation(player.id, data.stationId);
    if (existing) {
      throw new ErrorWithStatus({
        message: 'Người chơi đã được chấm điểm tại trạm này!',
        status: HTTP_STATUS.CONFLICT,
      });
    }

    return await scoreRepository.create({
      playerId: player.id,
      stationId: data.stationId,
      score: data.score,
      staffId,
    });
  };

  getByStation = async (staffId: string, stationId: string) => {
    const isAssigned = await scoreRepository.isStaffAssignedToStation(staffId, stationId);
    if (!isAssigned) {
      throw new ErrorWithStatus({
        message: 'Bạn không có quyền xem điểm tại trạm này!',
        status: HTTP_STATUS.FORBIDDEN,
      });
    }

    return await scoreRepository.findByStation(stationId);
  };
}

export default new ScoreService();
