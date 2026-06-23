import { privateApi, publicApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/common';
import type { PublicStationType, StationType } from '~/types/station';

class StationApi {
  static getAll = async () => {
    const response = await privateApi.get<ApiResponse<StationType[]>>('/stations');
    return response.data;
  };

  static getPublic = async () => {
    const response = await publicApi.get<ApiResponse<PublicStationType[]>>('/stations/public');
    return response.data;
  };

  static create = async (data: { name: string; description?: string | null; order: number; isReward?: boolean }) => {
    const response = await privateApi.post<ApiResponse<StationType>>('/stations', data);
    return response.data;
  };

  static update = async (id: string, data: Partial<{ name: string; description: string | null; order: number; isReward: boolean }>) => {
    const response = await privateApi.put<ApiResponse>(`/stations/${id}`, data);
    return response.data;
  };

  static delete = async (id: string) => {
    const response = await privateApi.delete<ApiResponse>(`/stations/${id}`);
    return response.data;
  };
}

export default StationApi;
