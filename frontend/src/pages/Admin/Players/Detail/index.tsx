import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import AdminApi from '~/api-requests/admin.requests';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { handleApiError } from '~/utils/handleApiError';

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
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/admin/players">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Người chơi: {player.mssv}</h1>
          <p className="mt-1 text-sm text-gray-600">Chi tiết điểm và trạng thái thưởng</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3 [&>div]:bg-white">
        <div className="rounded-xl px-4 py-3 shadow-xs">
          <h4 className="text-xs text-gray-500">Tổng điểm</h4>
          <span className="text-primary mt-2 inline-block text-4xl font-bold">{player.totalScore}</span>
        </div>
        <div className="rounded-xl px-4 py-3 shadow-xs">
          <h4 className="text-xs text-gray-500">Số trạm</h4>
          <span className="mt-2 inline-block text-4xl font-bold text-gray-900">{player.scores.length}</span>
        </div>
        <div className="rounded-xl px-4 py-3 shadow-xs">
          <h4 className="text-xs text-gray-500">Thưởng</h4>
          <span className="mt-2 inline-block text-lg font-medium text-gray-900">
            {rewardLabel(player.rewardStatus)}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200/70 bg-white shadow-xs">
        <div className="border-b border-gray-200/70 bg-linear-to-r from-gray-50/80 to-white px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">Điểm từng trạm</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Danh sách điểm tại các trạm đã hoàn thành
          </p>
        </div>
        {player.scores.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-500">Chưa có điểm nào.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                    Trạm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                    Điểm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                    Nhân sự chấm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                    Thời gian
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60 bg-white">
                {player.scores.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3.5 text-sm font-medium whitespace-nowrap text-gray-700 sm:px-6 sm:py-4">
                      {s.stationName}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-900 sm:px-6 sm:py-4">{s.score}</td>
                    <td className="px-4 py-3.5 text-sm font-mono text-gray-500 sm:px-6 sm:py-4">{s.staffMssv}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-500 sm:px-6 sm:py-4">
                      {new Date(s.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                      <div className="flex gap-1">
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
              <Input
                type="number"
                min={1}
                max={3}
                value={editScore}
                onChange={(e) => setEditScore(e.target.value)}
                required
              />
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
