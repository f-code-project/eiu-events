import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Award, Trophy } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import PlayerApi from '~/api-requests/player.requests';
import Loading from '~/components/Loading';
import StationCard from '~/components/StationCard';
import { RewardStatus } from '~/constants/enums';
import useAuth from '~/hooks/useAuth';
import useSocket from '~/hooks/useSocket';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

const PlayerDashboard = () => {
  const { user, fetchUser } = useAuth();
  const queryClient = useQueryClient();
  const [requesting, setRequesting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['player-progress'],
    queryFn: PlayerApi.getProgress,
  });

  useSocket({
    joinRoom: user ? { event: 'join:player', data: user.id } : undefined,
    events: {
      'reward:completed': () => {
        toast.success('Bạn đã được trao thưởng!');
        queryClient.invalidateQueries({ queryKey: ['player-progress'] });
        fetchUser();
      },
    },
  });

  const handleRequestReward = async () => {
    setRequesting(true);
    try {
      await PlayerApi.requestReward();
      toast.success('Gửi yêu cầu thành công!');
      queryClient.invalidateQueries({ queryKey: ['player-progress'] });
      fetchUser();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
      }
    } finally {
      setRequesting(false);
    }
  };

  if (isLoading) return <Loading />;

  const progress = data?.result;
  if (!progress) return null;

  const gameStations = progress.stations.filter((s) => !s.isReward);
  const rewardStatus = progress.rewardStatus;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Tiến trình</p>
            <p className="text-2xl font-bold">
              {progress.completedCount}/{progress.totalStations} trạm
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Tổng điểm</p>
            <p className="text-3xl font-bold text-primary">{progress.totalScore}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Danh sách trạm</h2>
        {gameStations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>

      <div className="pb-6">
        {rewardStatus === RewardStatus.NONE && progress.allCompleted && (
          <Button className="w-full gap-2" size="lg" onClick={handleRequestReward} disabled={requesting}>
            <Award size={20} />
            {requesting ? 'Đang gửi...' : 'Nhận thưởng'}
          </Button>
        )}

        {rewardStatus === RewardStatus.NONE && !progress.allCompleted && (
          <Button className="w-full gap-2" size="lg" disabled>
            <Award size={20} />
            Hoàn thành tất cả trạm để nhận thưởng
          </Button>
        )}

        {rewardStatus === RewardStatus.PENDING && (
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="animate-pulse text-amber-500">⏳</div>
              <p className="font-medium text-amber-700">Đang chờ trao thưởng...</p>
            </CardContent>
          </Card>
        )}

        {rewardStatus === RewardStatus.COMPLETED && (
          <Card className="border-green-300 bg-green-50">
            <CardContent className="flex items-center gap-3 p-4">
              <Trophy className="text-green-500" size={24} />
              <p className="font-medium text-green-700">Đã nhận thưởng!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;
