export type DashboardStats = {
  totalPlayers: number;
  totalStations: number;
  stationStats: Array<{
    stationId: string;
    stationName: string;
    order: number;
    isReward: boolean;
    completedCount: number;
    avgScore: number;
  }>;
  completedAllStations: number;
  rewardStats: {
    pending: number;
    completed: number;
  };
};

export type PlayerListItem = {
  id: string;
  mssv: string;
  rewardStatus: string;
  createdAt: string;
  scores: Array<{ stationId: string; stationName: string; score: number }>;
  totalScore: number;
  completedStations: number;
};

export type PlayerDetail = {
  id: string;
  mssv: string;
  rewardStatus: string;
  createdAt: string;
  scores: Array<{
    id: string;
    stationId: string;
    stationName: string;
    score: number;
    staffMssv: string;
    createdAt: string;
  }>;
  totalScore: number;
};
