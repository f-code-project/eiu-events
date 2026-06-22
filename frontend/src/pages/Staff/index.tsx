import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import ScoreApi from '~/api-requests/score.requests';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

const StaffScoreEntry = () => {
  const queryClient = useQueryClient();
  const [selectedStation, setSelectedStation] = useState('');
  const [mssv, setMssv] = useState('');
  const [score, setScore] = useState('');

  const { data: stationsData, isLoading: loadingStations } = useQuery({
    queryKey: ['my-stations'],
    queryFn: ScoreApi.getMyStations,
  });

  const staffStations = stationsData?.result?.filter((s) => !s.isReward) ?? [];

  const { data: stationScores, isLoading: loadingScores } = useQuery({
    queryKey: ['station-scores', selectedStation],
    queryFn: () => ScoreApi.getStationScores(selectedStation),
    enabled: !!selectedStation,
  });

  const scoreMutation = useMutation({
    mutationFn: ScoreApi.createScore,
    onSuccess: () => {
      toast.success('Chấm điểm thành công!');
      setMssv('');
      setScore('');
      queryClient.invalidateQueries({ queryKey: ['station-scores', selectedStation] });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStation || !mssv || !score) return;

    scoreMutation.mutate({
      mssv: mssv.trim(),
      stationId: selectedStation,
      score: Number(score),
    });
  };

  if (loadingStations) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Chấm điểm</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Trạm</Label>
              <Select value={selectedStation} onValueChange={setSelectedStation}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạm" />
                </SelectTrigger>
                <SelectContent>
                  {staffStations.map((s) => (
                    <SelectItem key={s.stationId} value={s.stationId}>
                      {s.stationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="mssv">MSSV người chơi</Label>
              <Input id="mssv" value={mssv} onChange={(e) => setMssv(e.target.value)} placeholder="Nhập MSSV" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Điểm</Label>
              <div className="flex gap-2">
                {[1, 2, 3].map((v) => (
                  <Button
                    key={v}
                    type="button"
                    variant={score === String(v) ? 'default' : 'outline'}
                    className="flex-1 text-lg"
                    onClick={() => setScore(String(v))}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={scoreMutation.isPending || !selectedStation || !mssv || !score}>
              {scoreMutation.isPending ? 'Đang chấm...' : 'Xác nhận'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {selectedStation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lịch sử chấm điểm</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingScores ? (
              <Loading />
            ) : !stationScores?.result?.length ? (
              <p className="text-sm text-muted-foreground">Chưa có ai được chấm điểm tại trạm này.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-2 font-medium">MSSV</th>
                      <th className="pb-2 font-medium">Điểm</th>
                      <th className="pb-2 font-medium">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stationScores.result.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-2 font-mono">{item.playerMssv}</td>
                        <td className="py-2 font-bold">{item.score}</td>
                        <td className="py-2 text-muted-foreground">{new Date(item.createdAt).toLocaleTimeString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffScoreEntry;
