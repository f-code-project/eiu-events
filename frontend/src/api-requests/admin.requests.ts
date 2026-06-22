import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/common';
import type { DashboardStats, PlayerDetail, PlayerListItem } from '~/types/admin';

class AdminApi {
  static getDashboard = async () => {
    const response = await privateApi.get<ApiResponse<DashboardStats>>('/admin/dashboard');
    return response.data;
  };

  static getPlayers = async () => {
    const response = await privateApi.get<ApiResponse<PlayerListItem[]>>('/admin/players');
    return response.data;
  };

  static getPlayerDetail = async (id: string) => {
    const response = await privateApi.get<ApiResponse<PlayerDetail>>(`/admin/players/${id}`);
    return response.data;
  };

  static updateScore = async (scoreId: string, score: number) => {
    const response = await privateApi.put<ApiResponse>(`/admin/scores/${scoreId}`, { score });
    return response.data;
  };

  static deleteScore = async (scoreId: string) => {
    const response = await privateApi.delete<ApiResponse>(`/admin/scores/${scoreId}`);
    return response.data;
  };
}

export default AdminApi;
