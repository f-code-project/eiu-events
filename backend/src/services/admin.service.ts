import { HTTP_STATUS } from '~/constants/httpStatus';
import adminRepository from '~/repositories/admin.repository';
import { ErrorWithStatus } from '~/rules/error';

class AdminService {
  getDashboard = async () => {
    return await adminRepository.getDashboardStats();
  };

  getPlayers = async () => {
    return await adminRepository.getPlayers();
  };

  getPlayerById = async (playerId: string) => {
    const player = await adminRepository.getPlayerById(playerId);
    if (!player) {
      throw new ErrorWithStatus({
        message: 'Người chơi không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }
    return player;
  };

  updateScore = async (scoreId: string, score: number) => {
    const existing = await adminRepository.findScoreById(scoreId);
    if (!existing) {
      throw new ErrorWithStatus({
        message: 'Điểm không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (score < 1 || score > 3) {
      throw new ErrorWithStatus({
        message: 'Điểm phải từ 1 đến 3!',
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }

    await adminRepository.updateScore(scoreId, score);
  };

  deleteScore = async (scoreId: string) => {
    const existing = await adminRepository.findScoreById(scoreId);
    if (!existing) {
      throw new ErrorWithStatus({
        message: 'Điểm không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    await adminRepository.deleteScore(scoreId);
  };
}

export default new AdminService();
