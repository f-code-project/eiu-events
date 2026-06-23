import { useQuery } from '@tanstack/react-query';
import { Code2, Database, Gamepad2, MapPin, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import StationApi from '~/api-requests/station.requests';
import { Button } from '~/components/ui/button';
import useAuth from '~/hooks/useAuth';

import type { PublicStationType } from '~/types/station';

const STATION_ICONS: Record<number, React.ReactNode> = {
  1: <Code2 className="h-6 w-6" />,
  2: <Database className="h-6 w-6" />,
  3: <Sparkles className="h-6 w-6" />,
  4: <Gamepad2 className="h-6 w-6" />,
};

const STATION_COLORS: Record<number, { bg: string; border: string; text: string; dot: string; line: string }> = {
  1: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    line: 'from-blue-500',
  },
  2: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    line: 'from-emerald-500',
  },
  3: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-600',
    dot: 'bg-violet-500',
    line: 'from-violet-500',
  },
  4: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
    dot: 'bg-orange-500',
    line: 'from-orange-500',
  },
};

const StationTimeline = ({ station }: { station: PublicStationType }) => {
  const colors = STATION_COLORS[station.order] ?? STATION_COLORS[1];
  const icon = STATION_ICONS[station.order] ?? <MapPin className="h-6 w-6" />;

  return (
    <div className="group relative flex gap-6 pb-12 last:pb-0">
      <div className="flex flex-col items-center">
        <div
          className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.border} ${colors.text} border-2 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
        >
          {icon}
        </div>
        <div className={`mt-2 h-full w-0.5 bg-gradient-to-b ${colors.line} to-transparent last:hidden`} />
      </div>

      <div
        className={`flex-1 rounded-xl border ${colors.border} bg-white px-5 py-4 shadow-xs transition-all duration-300 group-hover:shadow-md sm:px-6 sm:py-5`}
      >
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className={`text-xs font-bold tracking-wider uppercase ${colors.text}`}>Trạm {station.order}</span>
            <h3 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">{station.name}</h3>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <span className="text-primary block text-xl font-bold">{station.avgScore}</span>
              <span className="text-xs text-gray-500">Điểm TB</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-gray-900">{station.playerCount}</span>
              <span className="text-xs text-gray-500">Đã chơi</span>
            </div>
          </div>
        </div>

        {station.description && (
          <p className="text-sm leading-relaxed text-gray-600 sm:text-[15px]">{station.description}</p>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const { data } = useQuery({
    queryKey: ['public-stations'],
    queryFn: StationApi.getPublic,
  });

  const stations = (data?.result ?? []).filter((s) => !s.isReward);

  return (
    <div className="container mx-auto py-6">
      <section className="mb-10 text-center sm:mb-14">
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
          <img src="/fcode.png" alt="F-Code" className="relative z-10 h-full w-full" />
          <div className="bg-primary/20 absolute inset-0 rounded-full blur-xl"></div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Exploring IT Universe
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-gray-600 sm:text-lg">
          Khám phá vũ trụ công nghệ thông tin cùng CLB F-Code — Trải nghiệm các trạm thử thách thú vị!
        </p>

        {!isAuthenticated && (
          <div className="mt-6 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2 px-8 text-base">
                <Users className="h-5 w-5" />
                Đăng ký ngay
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="px-8 text-base">
                Đăng nhập
              </Button>
            </Link>
          </div>
        )}
      </section>

      {stations.length > 0 && (
        <section>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Các trạm đang hoạt động</h2>
            <p className="mt-2 text-sm text-gray-600">
              {stations.length} trạm thử thách đang chờ bạn chinh phục
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            {stations.map((station) => (
              <StationTimeline key={station.id} station={station} />
            ))}
          </div>

          {!isAuthenticated && (
            <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-8 text-center sm:mt-14">
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Sẵn sàng thử thách?</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                Đăng ký tài khoản ngay để tham gia chương trình, chinh phục các trạm và nhận thưởng!
              </p>
              <Link to="/register" className="mt-5 inline-block">
                <Button size="lg" className="gap-2 px-8">
                  <Users className="h-5 w-5" />
                  Tham gia ngay
                </Button>
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default HomePage;
