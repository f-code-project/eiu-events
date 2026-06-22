import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/common';
import type { RewardRequestType } from '~/types/reward';

class RewardApi {
  static getPending = async () => {
    const response = await privateApi.get<ApiResponse<RewardRequestType[]>>('/rewards/pending');
    return response.data;
  };

  static complete = async (rewardId: string) => {
    const response = await privateApi.put<ApiResponse>(`/rewards/${rewardId}/complete`);
    return response.data;
  };
}

export default RewardApi;
