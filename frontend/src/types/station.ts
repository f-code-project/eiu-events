export type StationType = {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isReward: boolean;
  createdAt: string;
};

export type PublicStationType = {
  id: string;
  name: string;
  description: string | null;
  order: number;
  isReward: boolean;
  playerCount: number;
  avgScore: string;
};

export type StaffStationType = {
  stationId: string;
  stationName: string;
};
