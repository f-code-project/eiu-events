import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import AdminApi from '~/api-requests/admin.requests';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
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

  const players = (data?.result ?? []).filter((p) => p.mssv.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Người chơi ({data?.result?.length ?? 0})</h2>
        <Input className="max-w-xs" placeholder="Tìm MSSV..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3 font-medium">MSSV</th>
                  <th className="p-3 font-medium">Tổng điểm</th>
                  <th className="p-3 font-medium">Trạm</th>
                  <th className="p-3 font-medium">Thưởng</th>
                  <th className="p-3 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-b last:border-0">
                    <td className="p-3 font-mono font-medium">{player.mssv}</td>
                    <td className="p-3 font-bold text-primary">{player.totalScore}</td>
                    <td className="p-3">{player.completedStations}</td>
                    <td className="p-3">{rewardBadge(player.rewardStatus)}</td>
                    <td className="p-3">
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
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                      Không tìm thấy người chơi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPlayers;
