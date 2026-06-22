import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/common';
import type { ProgressResponse } from '~/types/player';

class PlayerApi {
  static getProgress = async () => {
    const response = await privateApi.get<ApiResponse<ProgressResponse>>('/players/progress');
    return response.data;
  };

  static requestReward = async () => {
    const response = await privateApi.post<ApiResponse>('/players/request-reward');
    return response.data;
  };
}

export default PlayerApi;
