import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import AdminApi from '~/api-requests/admin.requests';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

const rewardBadge = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">Đã nhận</span>;
    case 'PENDING':
      return <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Chờ</span>;
    default:
      return <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">—</span>;
  }
};

const AdminPlayers = () => {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-players'],
    queryFn: AdminApi.getPlayers,
  });

  if (isLoading) return <Loading />;

  const allPlayers = data?.result ?? [];
  const players = allPlayers.filter((p) => p.mssv.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Người chơi</h1>
          <p className="mt-2 text-sm text-gray-600">Quản lý {allPlayers.length} người chơi trong hệ thống</p>
        </div>
        <Input
          className="max-w-xs"
          placeholder="Tìm MSSV..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200/70 bg-white shadow-xs">
        <div className="border-b border-gray-200/70 bg-linear-to-r from-gray-50/80 to-white px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">Danh sách người chơi</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Xem điểm, trạm và trạng thái thưởng của từng người chơi
          </p>
        </div>
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  STT
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  MSSV
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  Tổng điểm
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  Trạm
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  Thưởng
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60 bg-white">
              {players.map((player, index) => (
                <tr key={player.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-400 sm:px-6 sm:py-4">{index + 1}</td>
                  <td className="px-4 py-3.5 text-sm font-mono font-medium whitespace-nowrap text-gray-700 sm:px-6 sm:py-4">
                    {player.mssv}
                  </td>
                  <td className="text-primary px-4 py-3.5 text-sm font-bold sm:px-6 sm:py-4">{player.totalScore}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-700 sm:px-6 sm:py-4">{player.completedStations}</td>
                  <td className="px-4 py-3.5 text-sm sm:px-6 sm:py-4">{rewardBadge(player.rewardStatus)}</td>
                  <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                    <Link to={`/admin/players/${player.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye size={14} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {players.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    Không tìm thấy người chơi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPlayers;
