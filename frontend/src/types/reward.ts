export type RewardRequestType = {
  id: string;
  playerId: string;
  playerMssv: string;
  totalScore: number;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
};
