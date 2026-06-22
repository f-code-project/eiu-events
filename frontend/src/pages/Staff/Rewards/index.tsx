import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

import RewardApi from '~/api-requests/reward.requests';
import { handleApiError } from '~/utils/handleApiError';
import Loading from '~/components/Loading';
import useSocket from '~/hooks/useSocket';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const RewardStation = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['pending-rewards'],
    queryFn: RewardApi.getPending,
  });

  useSocket({
    joinRoom: { event: 'join:reward-station' },
    events: {
      'reward:request': () => {
        toast.info('Có yêu cầu đổi thưởng mới!');
        queryClient.invalidateQueries({ queryKey: ['pending-rewards'] });
      },
    },
  });

  const completeMutation = useMutation({
    mutationFn: RewardApi.complete,
    onSuccess: () => {
      toast.success('Trao thưởng thành công!');
      queryClient.invalidateQueries({ queryKey: ['pending-rewards'] });
    },
    onError: (err) => handleApiError(err),
  });

  if (isLoading) return <Loading />;

  const pending = data?.result ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Yêu cầu đổi thưởng ({pending.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!pending.length ? (
            <p className="text-sm text-muted-foreground">Chưa có yêu cầu nào.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {pending.map((request) => (
                <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-mono text-lg font-bold">{request.playerMssv}</p>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Tổng điểm: <span className="font-semibold text-primary">{request.totalScore}</span>
                      </span>
                      <span>{new Date(request.createdAt).toLocaleTimeString('vi-VN')}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={() => completeMutation.mutate(request.id)}
                    disabled={completeMutation.isPending}
                  >
                    <CheckCircle size={16} />
                    Đã trao thưởng
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardStation;
