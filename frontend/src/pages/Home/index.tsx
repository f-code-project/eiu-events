import { useQuery } from '@tanstack/react-query';
import { Code2, Database, Gamepad2, MapPin, Sparkles, Star, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

import StationApi from '~/api-requests/station.requests';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import useAuth from '~/hooks/useAuth';

import type { PublicStationType } from '~/types/station';

const STATION_THEME: Record<number, { icon: React.ReactNode; gradient: string; iconBg: string; accent: string }> = {
  1: {
    icon: <Code2 className="h-5 w-5" />,
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500',
    accent: 'text-blue-600',
  },
  2: {
    icon: <Database className="h-5 w-5" />,
    gradient: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500',
    accent: 'text-emerald-600',
  },
  3: {
    icon: <Sparkles className="h-5 w-5" />,
    gradient: 'from-violet-500 to-purple-500',
    iconBg: 'bg-violet-500',
    accent: 'text-violet-600',
  },
  4: {
    icon: <Gamepad2 className="h-5 w-5" />,
    gradient: 'from-orange-500 to-amber-500',
    iconBg: 'bg-orange-500',
    accent: 'text-orange-600',
  },
};

const StationLeaf = ({ station, side }: { station: PublicStationType; side: 'left' | 'right' }) => {
  const theme = STATION_THEME[station.order] ?? {
    icon: <MapPin className="h-5 w-5" />,
    gradient: 'from-gray-500 to-gray-600',
    iconBg: 'bg-gray-500',
    accent: 'text-gray-600',
  };

  const isLeft = side === 'left';

  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-0">
      {/* Left content / spacer */}
      <div className={`${isLeft ? 'pr-6 sm:pr-8' : ''}`}>
        {isLeft && (
          <Card className="group border-0 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardContent className="p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-end gap-2">
                <Badge variant="secondary" className={`${theme.accent} font-semibold`}>
                  Trạm {station.order}
                </Badge>
              </div>
              <h3 className="mb-2 text-right text-base font-bold text-gray-900 sm:text-lg">{station.name}</h3>
              {station.description && (
                <p className="mb-4 text-right text-sm leading-relaxed text-gray-500">{station.description}</p>
              )}
              <div className="flex items-center justify-end gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{station.playerCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-sm font-semibold text-gray-700">{station.avgScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Center node */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} text-white shadow-lg ring-4 ring-white transition-transform duration-300 hover:scale-110`}
        >
          {theme.icon}
        </div>
      </div>

      {/* Right content / spacer */}
      <div className={`${!isLeft ? 'pl-6 sm:pl-8' : ''}`}>
        {!isLeft && (
          <Card className="group border-0 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <CardContent className="p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="secondary" className={`${theme.accent} font-semibold`}>
                  Trạm {station.order}
                </Badge>
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">{station.name}</h3>
              {station.description && (
                <p className="mb-4 text-sm leading-relaxed text-gray-500">{station.description}</p>
              )}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">{station.playerCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-sm font-semibold text-gray-700">{station.avgScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const MobileStationCard = ({ station }: { station: PublicStationType }) => {
  const theme = STATION_THEME[station.order] ?? {
    icon: <MapPin className="h-5 w-5" />,
    gradient: 'from-gray-500 to-gray-600',
    iconBg: 'bg-gray-500',
    accent: 'text-gray-600',
  };

  return (
    <div className="relative flex gap-4">
      {/* Vertical line + node */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} text-white shadow-lg ring-4 ring-white`}
        >
          {theme.icon}
        </div>
        <div className="mt-2 w-0.5 flex-1 rounded-full bg-gradient-to-b from-gray-200 to-transparent" />
      </div>

      {/* Card */}
      <Card className="mb-6 flex-1 border-0 shadow-md">
        <CardContent className="p-4">
          <Badge variant="secondary" className={`${theme.accent} mb-2 font-semibold`}>
            Trạm {station.order}
          </Badge>
          <h3 className="mb-1.5 text-base font-bold text-gray-900">{station.name}</h3>
          {station.description && (
            <p className="mb-3 text-sm leading-relaxed text-gray-500">{station.description}</p>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">{station.playerCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-sm font-semibold text-gray-700">{station.avgScore}</span>
            </div>
          </div>
        </CardContent>
      </Card>
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
      {/* Hero */}
      <section className="mb-12 text-center sm:mb-16">
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
          <img src="/fcode.png" alt="F-Code" className="relative z-10 h-full w-full" />
          <div className="bg-primary/25 absolute inset-0 animate-pulse rounded-full blur-xl"></div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Exploring IT Universe
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-gray-500 sm:text-lg">
          Khám phá vũ trụ công nghệ thông tin cùng CLB F-Code — Trải nghiệm các trạm thử thách thú vị!
        </p>

        {!isAuthenticated && (
          <div className="mt-7 flex flex-col items-center gap-3 sm:mt-9 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2 px-8 text-base shadow-md">
                <TrendingUp className="h-5 w-5" />
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

      {/* Station timeline */}
      {stations.length > 0 && (
        <section>
          <div className="mb-10 text-center sm:mb-12">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-sm font-medium">
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              {stations.length} trạm hoạt động
            </Badge>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Hành trình thử thách</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Chinh phục từng trạm theo thứ tự để thu thập điểm và nhận thưởng
            </p>
          </div>

          {/* Desktop: alternating left/right tree */}
          <div className="relative mx-auto hidden max-w-4xl md:block">
            {/* Center trunk line */}
            <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />

            <div className="flex flex-col gap-10">
              {stations.map((station, i) => (
                <StationLeaf key={station.id} station={station} side={i % 2 === 0 ? 'left' : 'right'} />
              ))}
            </div>

            {/* Bottom cap */}
            <div className="relative mt-6 flex justify-center">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 ring-4 ring-white">
                <Star className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Mobile: single column timeline */}
          <div className="mx-auto max-w-lg md:hidden">
            {stations.map((station) => (
              <MobileStationCard key={station.id} station={station} />
            ))}
          </div>

          {/* CTA for guests */}
          {!isAuthenticated && (
            <Card className="mx-auto mt-12 max-w-lg border-dashed bg-gray-50/80 sm:mt-16">
              <CardContent className="px-6 py-8 text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <TrendingUp className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Sẵn sàng thử thách?</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                  Đăng ký tài khoản ngay để tham gia chương trình, chinh phục các trạm và nhận thưởng!
                </p>
                <Link to="/register" className="mt-5 inline-block">
                  <Button size="lg" className="gap-2 px-8 shadow-md">
                    <Users className="h-5 w-5" />
                    Tham gia ngay
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </section>
      )}
    </div>
  );
};

export default HomePage;
