import { useQuery } from '@tanstack/react-query';
import { Award, CheckCircle, MapPin, Users } from 'lucide-react';

import AdminApi from '~/api-requests/admin.requests';
import Loading from '~/components/Loading';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
  <Card>
    <CardContent className="flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: AdminApi.getDashboard,
  });

  if (isLoading) return <Loading />;

  const stats = data?.result;
  if (!stats) return null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Người chơi" value={stats.totalPlayers} icon={Users} color="bg-blue-500" />
        <StatCard title="Số trạm" value={stats.totalStations} icon={MapPin} color="bg-purple-500" />
        <StatCard title="Hoàn thành tất cả" value={stats.completedAllStations} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Đã đổi thưởng" value={stats.rewardStats.completed} icon={Award} color="bg-amber-500" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thống kê theo trạm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Trạm</th>
                  <th className="pb-2 font-medium">Đã chơi</th>
                  <th className="pb-2 font-medium">Điểm TB</th>
                  <th className="pb-2 font-medium">Loại</th>
                </tr>
              </thead>
              <tbody>
                {stats.stationStats.map((s) => (
                  <tr key={s.stationId} className="border-b last:border-0">
                    <td className="py-2 font-medium">{s.stationName}</td>
                    <td className="py-2">{s.completedCount}</td>
                    <td className="py-2">{s.avgScore}</td>
                    <td className="py-2">
                      {s.isReward ? (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Đổi thưởng</span>
                      ) : (
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Trò chơi</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {stats.rewardStats.pending > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4">
            <p className="font-medium text-amber-700">
              ⏳ {stats.rewardStats.pending} yêu cầu đổi thưởng đang chờ xử lý
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
