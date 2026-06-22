import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/common';
import type { ScoreInput, StationScoreItem } from '~/types/score';

class ScoreApi {
  static getMyStations = async () => {
    const response = await privateApi.get<ApiResponse<Array<{ stationId: string; stationName: string; isReward: boolean }>>>(
      '/scores/my-stations',
    );
    return response.data;
  };

  static createScore = async (data: ScoreInput) => {
    const response = await privateApi.post<ApiResponse>('/scores', data);
    return response.data;
  };

  static getStationScores = async (stationId: string) => {
    const response = await privateApi.get<ApiResponse<StationScoreItem[]>>(`/scores/station/${stationId}`);
    return response.data;
  };
}

export default ScoreApi;
