import { and, eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { getIO } from '~/configs/socket';
import { RewardStatus } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { stationStaff, stations } from '~/db/schema';
import playerRepository from '~/repositories/player.repository';
import rewardRepository from '~/repositories/reward.repository';
import { ErrorWithStatus } from '~/rules/error';

class RewardService {
  getPending = async (staffId: string) => {
    await this.verifyRewardStationAccess(staffId);
    return await rewardRepository.findPending();
  };

  complete = async (rewardId: string, staffId: string) => {
    await this.verifyRewardStationAccess(staffId);

    const request = await rewardRepository.findById(rewardId);
    if (!request) {
      throw new ErrorWithStatus({
        message: 'Yêu cầu đổi thưởng không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (request.status === 'COMPLETED') {
      throw new ErrorWithStatus({
        message: 'Yêu cầu đã được xử lý!',
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    await rewardRepository.complete(rewardId, staffId);
    await playerRepository.updateRewardStatus(request.playerId, RewardStatus.COMPLETED);

    const io = getIO();
    io.to(`player:${request.playerId}`).emit('reward:completed', {
      message: 'Bạn đã được trao thưởng!',
    });

    return { id: rewardId, status: 'COMPLETED' };
  };

  private verifyRewardStationAccess = async (staffId: string) => {
    const [access] = await db
      .select()
      .from(stationStaff)
      .innerJoin(stations, eq(stationStaff.stationId, stations.id))
      .where(and(eq(stationStaff.userId, staffId), eq(stations.isReward, true)));

    if (!access) {
      throw new ErrorWithStatus({
        message: 'Bạn không có quyền xử lý đổi thưởng!',
        status: HTTP_STATUS.FORBIDDEN,
      });
    }
  };
}

export default new RewardService();
