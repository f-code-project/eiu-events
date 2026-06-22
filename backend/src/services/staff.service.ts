import { RoleType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import staffRepository from '~/repositories/staff.repository';
import userRepository from '~/repositories/user.repository';
import { ErrorWithStatus } from '~/rules/error';
import { AlgoCrypto } from '~/utils/crypto';

class StaffService {
  getAll = async () => {
    return await staffRepository.findAll();
  };

  getById = async (id: string) => {
    const staff = await staffRepository.findById(id);
    if (!staff) {
      throw new ErrorWithStatus({
        message: 'Nhân sự không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }
    return staff;
  };

  create = async (data: { mssv: string; password: string; stationIds: string[] }) => {
    const existing = await userRepository.findByMssv(data.mssv);
    if (existing) {
      throw new ErrorWithStatus({
        message: 'MSSV đã được sử dụng!',
        status: HTTP_STATUS.CONFLICT,
      });
    }

    await this.validateStationIds(data.stationIds);

    const hashedPassword = AlgoCrypto.hashPassword(data.password);
    const userId = await staffRepository.createUser({
      mssv: data.mssv,
      password: hashedPassword,
      role: RoleType.STATION_STAFF,
    });

    await staffRepository.assignStations(userId, data.stationIds);

    return await staffRepository.findById(userId);
  };

  update = async (id: string, data: { mssv?: string; password?: string; stationIds?: string[] }) => {
    const staff = await this.getById(id);

    if (data.mssv && data.mssv !== staff.mssv) {
      const existing = await userRepository.findByMssv(data.mssv);
      if (existing) {
        throw new ErrorWithStatus({
          message: 'MSSV đã được sử dụng!',
          status: HTTP_STATUS.CONFLICT,
        });
      }
    }

    const updateData: Partial<{ mssv: string; password: string }> = {};
    if (data.mssv) updateData.mssv = data.mssv;
    if (data.password) updateData.password = AlgoCrypto.hashPassword(data.password);

    if (Object.keys(updateData).length > 0) {
      await staffRepository.updateUser(id, updateData);
    }

    if (data.stationIds) {
      await this.validateStationIds(data.stationIds);
      await staffRepository.removeStations(id);
      await staffRepository.assignStations(id, data.stationIds);
    }

    return await staffRepository.findById(id);
  };

  delete = async (id: string) => {
    await this.getById(id);
    await staffRepository.deleteUser(id);
  };

  private validateStationIds = async (stationIds: string[]) => {
    const foundStations = await staffRepository.findStationsByIds(stationIds);
    if (foundStations.length !== stationIds.length) {
      throw new ErrorWithStatus({
        message: 'Một hoặc nhiều trạm không tồn tại!',
        status: HTTP_STATUS.BAD_REQUEST,
      });
    }
  };
}

export default new StaffService();
