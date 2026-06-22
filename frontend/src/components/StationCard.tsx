import { CheckCircle, Circle, Gift, MapPin } from 'lucide-react';

import { cn } from '~/lib/utils';
import { Card, CardContent } from '~/components/ui/card';

import type { StationProgress } from '~/types/player';

type Props = {
  station: StationProgress;
};

const StationCard = ({ station }: Props) => {
  const Icon = station.isReward ? Gift : station.completed ? CheckCircle : Circle;

  return (
    <Card
      className={cn(
        'transition-all',
        station.completed && 'border-green-300 bg-green-50',
        station.isReward && 'border-amber-300 bg-amber-50',
      )}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            station.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400',
            station.isReward && 'bg-amber-100 text-amber-600',
          )}
        >
          <Icon size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-muted-foreground" />
            <span className="truncate font-medium">{station.name}</span>
          </div>
          {station.isReward ? (
            <p className="text-sm text-amber-600">Trạm đổi thưởng</p>
          ) : station.completed ? (
            <p className="text-sm text-green-600">Đã hoàn thành</p>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa chơi</p>
          )}
        </div>

        {!station.isReward && (
          <div className="text-right">
            <span className={cn('text-xl font-bold', station.completed ? 'text-green-600' : 'text-gray-300')}>
              {station.score ?? '-'}
            </span>
            <p className="text-xs text-muted-foreground">điểm</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StationCard;
