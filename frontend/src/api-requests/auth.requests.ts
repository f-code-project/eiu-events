import { privateApi, publicApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/common';
import type { LoginInput, RegisterInput, UserType } from '~/types/user';

class AuthApi {
  static register = async (data: RegisterInput) => {
    const response = await publicApi.post<ApiResponse<{ id: string; mssv: string }>>('/auth/register', data);
    return response.data;
  };

  static login = async (data: LoginInput) => {
    const response = await publicApi.post<ApiResponse<UserType>>('/auth/login', data);
    return response.data;
  };

  static getMe = async () => {
    const response = await privateApi.get<ApiResponse<UserType>>('/auth/me');
    return response.data;
  };

  static logout = async () => {
    const response = await privateApi.post<ApiResponse>('/auth/logout');
    return response.data;
  };
}

export default AuthApi;
