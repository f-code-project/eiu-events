import { useQuery } from '@tanstack/react-query';
import { Brain, ChevronRight, Code2, Database, Gamepad2, MapPin, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

import StationApi from '~/api-requests/station.requests';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import useAuth from '~/hooks/useAuth';

import type { PublicStationType } from '~/types/station';

const STATION_THEMES: Record<number, { icon: React.ReactNode; gradient: string; glow: string; badge: string }> = {
  1: {
    icon: <Code2 className="h-5 w-5" />,
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'shadow-blue-500/25',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  2: {
    icon: <Database className="h-5 w-5" />,
    gradient: 'from-emerald-500 to-teal-400',
    glow: 'shadow-emerald-500/25',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  3: {
    icon: <Brain className="h-5 w-5" />,
    gradient: 'from-violet-500 to-purple-400',
    glow: 'shadow-violet-500/25',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
  },
  4: {
    icon: <Gamepad2 className="h-5 w-5" />,
    gradient: 'from-orange-500 to-amber-400',
    glow: 'shadow-orange-500/25',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
  },
};

const fallbackTheme = {
  icon: <MapPin className="h-5 w-5" />,
  gradient: 'from-gray-500 to-gray-400',
  glow: 'shadow-gray-500/25',
  badge: 'bg-gray-50 text-gray-700 border-gray-200',
};

const StationCard = ({ station }: { station: PublicStationType }) => {
  const theme = STATION_THEMES[station.order] ?? fallbackTheme;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${theme.gradient}`} />
      <div
        className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${theme.gradient} opacity-[0.04] blur-2xl transition-all duration-500 group-hover:opacity-[0.08]`}
      />

      <div className="relative px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
        <div className="mb-4 flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.gradient} ${theme.glow} text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}
          >
            {theme.icon}
          </div>
          <div className="min-w-0 flex-1">
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${theme.badge}`}>
              Trạm {station.order}
            </span>
            <h3 className="mt-1.5 text-[17px] leading-snug font-bold text-gray-900">{station.name}</h3>
          </div>
        </div>

        {station.description && (
          <p className="mb-4 line-clamp-3 text-[13px] leading-relaxed text-gray-500">{station.description}</p>
        )}

        <div className="flex items-center gap-5 border-t border-gray-100 pt-3.5">
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${theme.gradient} bg-opacity-10`}>
              <Trophy className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900">{station.avgScore}</span>
              <span className="ml-1 text-[11px] text-gray-400">điểm TB</span>
            </div>
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${theme.gradient} bg-opacity-10`}>
              <Users className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-900">{station.playerCount}</span>
              <span className="ml-1 text-[11px] text-gray-400">đã chơi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StationTimeline = ({ station, index }: { station: PublicStationType; index: number }) => {
  const theme = STATION_THEMES[station.order] ?? fallbackTheme;
  const isLeft = index % 2 === 0;

  return (
    <div
      className="animate-fade-in-up relative"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
    >
      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-[1fr_80px_1fr] md:items-center">
        <div className={isLeft ? '' : 'col-start-3'}>{isLeft && <StationCard station={station} />}</div>

        <div className={`col-start-2 flex justify-center ${isLeft ? '' : 'row-start-1'}`}>
          <div
            className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} ${theme.glow} text-white shadow-lg ring-[5px] ring-white transition-all duration-500 hover:scale-125`}
          >
            {theme.icon}
            <div className={`absolute inset-0 animate-ping rounded-full bg-gradient-to-br ${theme.gradient} opacity-20`} />
          </div>
        </div>

        <div className={isLeft ? 'col-start-3' : 'col-start-1 row-start-1'}>{!isLeft && <StationCard station={station} />}</div>
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-[48px_1fr] items-center gap-4 md:hidden">
        <div className="flex justify-center">
          <div
            className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} ${theme.glow} text-white shadow-lg ring-4 ring-white`}
          >
            {theme.icon}
          </div>
        </div>
        <StationCard station={station} />
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
    <div className="py-6 sm:py-10">
      {/* Hero */}
      <section className="animate-fade-in-down relative mb-16 overflow-hidden text-center sm:mb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-primary/8 absolute top-10 left-1/4 h-72 w-72 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 h-56 w-56 rounded-full bg-blue-400/8 blur-3xl" />
        </div>

        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          <img src="/fcode.png" alt="F-Code" className="animate-floating relative z-10 h-full w-full drop-shadow-lg" />
          <div className="bg-primary/20 absolute inset-0 scale-150 rounded-full blur-2xl" />
          <div className="absolute inset-0 scale-[2] rounded-full bg-gradient-to-br from-blue-400/10 to-emerald-400/10 blur-3xl" />
        </div>

        <Badge variant="outline" className="animate-fade-in mb-4 gap-1.5 px-4 py-1.5 text-sm">
          <Sparkles className="h-3.5 w-3.5" />
          CLB F-Code — EIU
        </Badge>

        <h1 className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Exploring IT Universe
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
          Khám phá vũ trụ công nghệ thông tin cùng CLB F-Code
          <br className="hidden sm:block" />
          Trải nghiệm các trạm thử thách thú vị và nhận thưởng hấp dẫn!
        </p>

        {!isAuthenticated && (
          <div className="animate-fade-in-up mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2 px-8 text-[15px] shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30">
                <Zap className="h-4.5 w-4.5" />
                Đăng ký tham gia
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="gap-2 px-8 text-[15px]">
                Đăng nhập
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Timeline */}
      {stations.length > 0 && (
        <section>
          <div className="animate-fade-in mb-12 text-center sm:mb-16">
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
              <MapPin className="text-primary h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Hành trình khám phá</h2>
            <p className="mt-2.5 text-sm text-gray-500">
              {stations.length} trạm thử thách đang chờ bạn chinh phục
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Trunk line — desktop center, mobile left */}
            <div className="absolute top-6 bottom-6 left-[23px] w-[3px] rounded-full bg-gradient-to-b from-blue-200 via-emerald-200 via-60% via-violet-200 to-orange-200 md:left-1/2 md:-translate-x-1/2" />

            <div className="flex flex-col gap-12 md:gap-16">
              {stations.map((station, index) => (
                <StationTimeline key={station.id} station={station} index={index} />
              ))}
            </div>

            {/* End cap */}
            <div className="relative mt-12 flex justify-start pl-[11px] md:justify-center md:pl-0">
              <div className="bg-primary z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-lg shadow-primary/25 ring-[5px] ring-white">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>

          {/* Guest CTA */}
          {!isAuthenticated && (
            <div className="animate-fade-in-up relative mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-gray-200/60 bg-white p-8 text-center shadow-sm sm:mt-20 sm:p-10">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="bg-primary/5 absolute -top-10 -right-10 h-40 w-40 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-400/5 blur-2xl" />
              </div>

              <div className="bg-primary/10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Zap className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">Sẵn sàng thử thách?</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
                Đăng ký tài khoản ngay để tham gia chương trình, chinh phục các trạm và nhận thưởng hấp dẫn!
              </p>
              <Link to="/register" className="mt-6 inline-block">
                <Button size="lg" className="gap-2 px-10 shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30">
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
