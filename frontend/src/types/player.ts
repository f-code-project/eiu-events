import type { RewardStatus } from '~/constants/enums';

export type StationProgress = {
  id: string;
  name: string;
  order: number;
  isReward: boolean;
  score: number | null;
  completed: boolean;
};

export type ProgressResponse = {
  stations: StationProgress[];
  totalScore: number;
  completedCount: number;
  totalStations: number;
  allCompleted: boolean;
  rewardStatus: RewardStatus;
};
