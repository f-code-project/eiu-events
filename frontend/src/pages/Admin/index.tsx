import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AdminApi from '~/api-requests/admin.requests';
import Loading from '~/components/Loading';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: AdminApi.getDashboard,
  });

  if (isLoading) return <Loading />;

  const stats = data?.result;
  if (!stats) return null;

  return (
    <>
      <section className="mt-4 mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Trang Quản Trị</h1>
        <p className="mb-6 text-sm text-gray-600">Tổng quan hệ thống và quản lý dữ liệu</p>

        <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 [&>div]:bg-white">
          <div onClick={() => navigate('/admin/players')} className="cursor-pointer rounded-xl px-4 py-3 shadow-xs">
            <h4 className="text-xs text-gray-500">Người chơi</h4>
            <span className="mt-2 inline-block text-4xl font-bold text-gray-900">{stats.totalPlayers}</span>
            <div className="text-primary mt-2 flex items-center gap-1 text-xs font-medium">
              Xem chi tiết
              <ArrowRight className="h-3 w-3 transition-transform" />
            </div>
          </div>

          <div onClick={() => navigate('/admin/stations')} className="cursor-pointer rounded-xl px-4 py-3 shadow-xs">
            <h4 className="text-xs text-gray-500">Trạm chơi</h4>
            <span className="mt-2 inline-block text-4xl font-bold text-gray-900">{stats.totalStations}</span>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-teal-600">
              Xem chi tiết
              <ArrowRight className="h-3 w-3 transition-transform" />
            </div>
          </div>

          <div onClick={() => navigate('/admin/staff')} className="cursor-pointer rounded-xl px-4 py-3 shadow-xs">
            <h4 className="text-xs text-gray-500">Hoàn thành tất cả</h4>
            <span className="mt-2 inline-block text-4xl font-bold text-gray-900">{stats.completedAllStations}</span>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium text-teal-600">
              Xem
              <ArrowRight className="h-3 w-3 transition-transform" />
            </div>
          </div>

          <div className="rounded-xl px-4 py-3 shadow-xs">
            <h4 className="text-xs text-gray-500">Đã đổi thưởng</h4>
            <span className="mt-2 inline-block text-4xl font-bold text-gray-900">{stats.rewardStats.completed}</span>
            {stats.rewardStats.pending > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-600">
                ⏳ {stats.rewardStats.pending} đang chờ
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="overflow-hidden rounded-lg border border-gray-200/70 bg-white shadow-xs">
          <div className="border-b border-gray-200/70 bg-linear-to-r from-gray-50/80 to-white px-5 py-4 sm:px-6 sm:py-5">
            <h3 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">Thống kê theo trạm</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
              Số lượng người chơi và điểm trung bình tại mỗi trạm
            </p>
          </div>
          <div className="overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                    Trạm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                    Đã chơi
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                    Điểm TB
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                    Loại
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60 bg-white">
                {stats.stationStats.map((s) => (
                  <tr key={s.stationId} className="transition-colors hover:bg-gray-50/50">
                    <td className="px-4 py-3.5 text-sm font-medium whitespace-nowrap text-gray-700 sm:px-6 sm:py-4">
                      {s.stationName}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 sm:px-6 sm:py-4">{s.completedCount}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 sm:px-6 sm:py-4">{s.avgScore}</td>
                    <td className="px-4 py-3.5 text-sm sm:px-6 sm:py-4">
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
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
