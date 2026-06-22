export type ScoreInput = {
  mssv: string;
  stationId: string;
  score: number;
};

export type StationScoreItem = {
  id: string;
  playerId: string;
  playerMssv: string;
  score: number;
  createdAt: string;
};
