import { useQuery } from '@tanstack/react-query';
import { Brain, Code2, Database, Gamepad2, MapPin, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import StationApi from '~/api-requests/station.requests';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import useAuth from '~/hooks/useAuth';

import type { PublicStationType } from '~/types/station';

const STATION_THEMES: Record<number, { icon: React.ReactNode; gradient: string; iconBg: string; accent: string }> = {
  1: {
    icon: <Code2 className="h-5 w-5" />,
    gradient: 'from-blue-500 to-cyan-400',
    iconBg: 'bg-blue-500',
    accent: 'text-blue-600',
  },
  2: {
    icon: <Database className="h-5 w-5" />,
    gradient: 'from-emerald-500 to-teal-400',
    iconBg: 'bg-emerald-500',
    accent: 'text-emerald-600',
  },
  3: {
    icon: <Brain className="h-5 w-5" />,
    gradient: 'from-violet-500 to-purple-400',
    iconBg: 'bg-violet-500',
    accent: 'text-violet-600',
  },
  4: {
    icon: <Gamepad2 className="h-5 w-5" />,
    gradient: 'from-orange-500 to-amber-400',
    iconBg: 'bg-orange-500',
    accent: 'text-orange-600',
  },
};

const StationNode = ({ station, side }: { station: PublicStationType; side: 'left' | 'right' }) => {
  const theme = STATION_THEMES[station.order] ?? {
    icon: <MapPin className="h-5 w-5" />,
    gradient: 'from-gray-500 to-gray-400',
    iconBg: 'bg-gray-500',
    accent: 'text-gray-600',
  };

  const cardContent = (
    <Card className="group relative overflow-hidden border-gray-200/80 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
      <CardContent className="px-5 pt-5 pb-4">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${theme.iconBg} text-white shadow-sm`}
          >
            {theme.icon}
          </div>
          <div className="min-w-0">
            <Badge variant="outline" className="mb-1 text-[10px]">
              Trạm {station.order}
            </Badge>
            <h3 className="truncate text-base font-bold text-gray-900">{station.name}</h3>
          </div>
        </div>

        {station.description && (
          <p className="mb-4 line-clamp-3 text-[13px] leading-relaxed text-gray-500">{station.description}</p>
        )}

        <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1.5">
            <Trophy className={`h-3.5 w-3.5 ${theme.accent}`} />
            <span className="text-sm font-semibold text-gray-900">{station.avgScore}</span>
            <span className="text-xs text-gray-400">điểm TB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className={`h-3.5 w-3.5 ${theme.accent}`} />
            <span className="text-sm font-semibold text-gray-900">{station.playerCount}</span>
            <span className="text-xs text-gray-400">đã chơi</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="relative flex items-center">
      {/* Desktop: alternating left/right */}
      <div className="hidden w-full grid-cols-[1fr_auto_1fr] items-center gap-0 md:grid">
        <div className={side === 'left' ? 'pr-8' : ''}>
          {side === 'left' && cardContent}
        </div>

        <div className="relative flex flex-col items-center">
          <div
            className={`z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} text-white shadow-md ring-4 ring-white`}
          >
            {theme.icon}
          </div>
        </div>

        <div className={side === 'right' ? 'pl-8' : ''}>
          {side === 'right' && cardContent}
        </div>
      </div>

      {/* Mobile: always right of the line */}
      <div className="grid w-full grid-cols-[auto_1fr] items-center gap-0 md:hidden">
        <div className="relative flex flex-col items-center">
          <div
            className={`z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} text-white shadow-md ring-4 ring-white`}
          >
            {theme.icon}
          </div>
        </div>
        <div className="pl-5">{cardContent}</div>
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
    <div className="py-6">
      <section className="mb-12 text-center sm:mb-16">
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
          <img src="/fcode.png" alt="F-Code" className="relative z-10 h-full w-full" />
          <div className="bg-primary/25 absolute inset-0 scale-150 rounded-full blur-2xl"></div>
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
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Hành trình khám phá</h2>
            <p className="mt-2 text-sm text-gray-500">{stations.length} trạm thử thách đang chờ bạn chinh phục</p>
          </div>

          {/* Timeline tree */}
          <div className="relative mx-auto max-w-4xl">
            {/* Vertical trunk line — desktop center, mobile left */}
            <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-gradient-to-b from-blue-300 via-emerald-300 via-violet-300 to-orange-300 md:left-1/2 md:-translate-x-1/2" />

            <div className="flex flex-col gap-10 md:gap-14">
              {stations.map((station, index) => (
                <StationNode key={station.id} station={station} side={index % 2 === 0 ? 'left' : 'right'} />
              ))}
            </div>

            {/* End dot */}
            <div className="relative mt-10 flex justify-start md:justify-center">
              <div className="bg-primary z-10 ml-[13px] flex h-5 w-5 items-center justify-center rounded-full shadow-md ring-4 ring-white md:ml-0">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mt-14 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-10 text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
                <Users className="text-primary h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Sẵn sàng thử thách?</h3>
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
