import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import AdminApi from '~/api-requests/admin.requests';
import { handleApiError } from '~/utils/handleApiError';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const rewardLabel = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'Đã nhận thưởng';
    case 'PENDING':
      return 'Đang chờ trao thưởng';
    default:
      return 'Chưa nhận';
  }
};

const PlayerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-player', id],
    queryFn: () => AdminApi.getPlayerDetail(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: ({ scoreId, score }: { scoreId: string; score: number }) => AdminApi.updateScore(scoreId, score),
    onSuccess: () => {
      toast.success('Cập nhật điểm thành công!');
      setEditingScoreId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-player', id] });
    },
    onError: (err) => handleApiError(err),
  });

  const deleteMutation = useMutation({
    mutationFn: AdminApi.deleteScore,
    onSuccess: () => {
      toast.success('Xoá điểm thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin-player', id] });
    },
    onError: (err) => handleApiError(err),
  });

  if (isLoading) return <Loading />;

  const player = data?.result;
  if (!player) return <p>Không tìm thấy người chơi.</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/players">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h2 className="text-xl font-bold">Người chơi: {player.mssv}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng điểm</p>
            <p className="text-2xl font-bold text-primary">{player.totalScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Số trạm</p>
            <p className="text-2xl font-bold">{player.scores.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Thưởng</p>
            <p className="text-lg font-medium">{rewardLabel(player.rewardStatus)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Điểm từng trạm</CardTitle>
        </CardHeader>
        <CardContent>
          {player.scores.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có điểm nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Trạm</th>
                    <th className="pb-2 font-medium">Điểm</th>
                    <th className="pb-2 font-medium">Nhân sự chấm</th>
                    <th className="pb-2 font-medium">Thời gian</th>
                    <th className="pb-2 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {player.scores.map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-2">{s.stationName}</td>
                      <td className="py-2 font-bold">{s.score}</td>
                      <td className="py-2 font-mono text-muted-foreground">{s.staffMssv}</td>
                      <td className="py-2 text-muted-foreground">{new Date(s.createdAt).toLocaleString('vi-VN')}</td>
                      <td className="flex gap-1 py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingScoreId(s.id);
                            setEditScore(String(s.score));
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            if (confirm('Xác nhận xoá điểm này?')) deleteMutation.mutate(s.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingScoreId} onOpenChange={(open) => !open && setEditingScoreId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa điểm</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingScoreId) updateMutation.mutate({ scoreId: editingScoreId, score: Number(editScore) });
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label>Điểm (1-3)</Label>
              <Input type="number" min={1} max={3} value={editScore} onChange={(e) => setEditScore(e.target.value)} required />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerDetailPage;
