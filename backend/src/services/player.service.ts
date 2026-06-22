import { RewardStatus } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import playerRepository from '~/repositories/player.repository';
import rewardRepository from '~/repositories/reward.repository';
import userRepository from '~/repositories/user.repository';
import { ErrorWithStatus } from '~/rules/error';
import { getIO } from '~/configs/socket';

class PlayerService {
  getProgress = async (playerId: string) => {
    const user = await userRepository.findById(playerId);
    if (!user) {
      throw new ErrorWithStatus({
        message: 'Người dùng không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    const progress = await playerRepository.getProgress(playerId);
    return { ...progress, rewardStatus: user.rewardStatus };
  };

  requestReward = async (playerId: string) => {
    const user = await userRepository.findById(playerId);
    if (!user) {
      throw new ErrorWithStatus({
        message: 'Người dùng không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (user.rewardStatus === RewardStatus.PENDING) {
      throw new ErrorWithStatus({
        message: 'Bạn đã gửi yêu cầu, vui lòng chờ!',
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    if (user.rewardStatus === RewardStatus.COMPLETED) {
      throw new ErrorWithStatus({
        message: 'Bạn đã nhận thưởng!',
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    const progress = await playerRepository.getProgress(playerId);
    if (!progress.allCompleted) {
      throw new ErrorWithStatus({
        message: 'Bạn chưa hoàn thành tất cả trạm!',
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    await playerRepository.updateRewardStatus(playerId, RewardStatus.PENDING);
    const request = await rewardRepository.create({
      playerId,
      totalScore: progress.totalScore,
    });

    const io = getIO();
    io.to('reward-station').emit('reward:request', {
      id: request.id,
      mssv: user.mssv,
      totalScore: progress.totalScore,
      requestedAt: new Date().toISOString(),
    });

    return request;
  };
}

export default new PlayerService();
