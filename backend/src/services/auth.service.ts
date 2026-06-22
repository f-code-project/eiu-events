import redisClient from '~/configs/redis';
import { ExpiresInTokenType, RoleType, TokenType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';
import userRepository from '~/repositories/user.repository';
import { ErrorWithStatus } from '~/rules/error';
import { AlgoCrypto } from '~/utils/crypto';
import { AlgoJwt } from '~/utils/jwt';

class AuthService {
  register = async (data: { mssv: string; password: string }) => {
    const existing = await userRepository.findByMssv(data.mssv);
    if (existing) {
      throw new ErrorWithStatus({
        message: 'MSSV đã được đăng ký!',
        status: HTTP_STATUS.CONFLICT,
      });
    }

    const hashedPassword = AlgoCrypto.hashPassword(data.password);
    return await userRepository.create({
      mssv: data.mssv,
      password: hashedPassword,
      role: RoleType.PLAYER,
    });
  };

  login = async (data: { mssv: string; password: string }) => {
    const user = await userRepository.findByMssv(data.mssv);
    if (!user) {
      throw new ErrorWithStatus({
        message: 'MSSV hoặc mật khẩu không đúng!',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const isValid = await AlgoCrypto.verifyPassword(data.password, user.password);
    if (!isValid) {
      throw new ErrorWithStatus({
        message: 'MSSV hoặc mật khẩu không đúng!',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const { accessToken, refreshToken } = await this.signAccessAndRefreshToken(user.id, user.role);
    const { password: _, ...userWithoutPassword } = user;

    return { accessToken, refreshToken, ...userWithoutPassword };
  };

  refreshToken = async (currentRefreshToken: string) => {
    if (!currentRefreshToken) {
      throw new ErrorWithStatus({
        message: 'Refresh token không được cung cấp!',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const userId = await redisClient.get(`refresh_token_user:${currentRefreshToken}`);
    if (!userId) {
      throw new ErrorWithStatus({
        message: 'Refresh token không hợp lệ hoặc đã hết hạn!',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const storedToken = await redisClient.get(`refresh_token:${userId}`);
    if (!storedToken || storedToken !== currentRefreshToken) {
      throw new ErrorWithStatus({
        message: 'Refresh token không hợp lệ!',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ErrorWithStatus({
        message: 'Người dùng không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    await redisClient.del(`refresh_token_user:${currentRefreshToken}`);
    const { accessToken, refreshToken } = await this.signAccessAndRefreshToken(userId, user.role);

    return { accessToken, refreshToken };
  };

  logout = async (userId: string) => {
    const tokenValue = await redisClient.get(`refresh_token:${userId}`);
    if (tokenValue) {
      await redisClient.del(`refresh_token_user:${tokenValue}`);
    }
    await redisClient.del(`refresh_token:${userId}`);
  };

  getInfo = async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ErrorWithStatus({
        message: 'Người dùng không tồn tại!',
        status: HTTP_STATUS.NOT_FOUND,
      });
    }
    return user;
  };

  private signAccessToken = async (userId: string, role: string) => {
    return AlgoJwt.signToken({
      payload: { userId, role, type: TokenType.AccessToken },
      options: { expiresIn: ExpiresInTokenType.AccessToken },
    });
  };

  private signAccessAndRefreshToken = async (userId: string, role: string) => {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(userId, role),
      Promise.resolve(AlgoCrypto.generateOpaqueToken()),
    ]);

    await redisClient.set(`refresh_token:${userId}`, refreshToken, 'EX', ExpiresInTokenType.RefreshToken);
    await redisClient.set(`refresh_token_user:${refreshToken}`, userId, 'EX', ExpiresInTokenType.RefreshToken);

    return { accessToken, refreshToken };
  };
}

export default new AuthService();
