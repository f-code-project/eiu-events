import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import StationApi from '~/api-requests/station.requests';
import { handleApiError } from '~/utils/handleApiError';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Checkbox } from '~/components/ui/checkbox';

import type { StationType } from '~/types/station';

type FormState = { name: string; description: string; order: string; isReward: boolean };
const emptyForm: FormState = { name: '', description: '', order: '', isReward: false };

const AdminStations = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stations'],
    queryFn: StationApi.getAll,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { name: form.name, description: form.description || null, order: Number(form.order), isReward: form.isReward };
      if (editingId) {
        return await StationApi.update(editingId, payload);
      }
      return await StationApi.create(payload);
    },
    onSuccess: () => {
      toast.success(editingId ? 'Cập nhật thành công!' : 'Tạo trạm thành công!');
      closeDialog();
      queryClient.invalidateQueries({ queryKey: ['admin-stations'] });
    },
    onError: (err) => handleApiError(err),
  });

  const deleteMutation = useMutation({
    mutationFn: StationApi.delete,
    onSuccess: () => {
      toast.success('Xoá trạm thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin-stations'] });
    },
    onError: (err) => handleApiError(err),
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (station: StationType) => {
    setEditingId(station.id);
    setForm({ name: station.name, description: station.description ?? '', order: String(station.order), isReward: station.isReward });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  if (isLoading) return <Loading />;

  const stations = data?.result ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Quản lý trạm</h2>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus size={16} />
          Tạo trạm
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3 font-medium">Thứ tự</th>
                  <th className="p-3 font-medium">Tên</th>
                  <th className="p-3 font-medium">Mô tả</th>
                  <th className="p-3 font-medium">Loại</th>
                  <th className="p-3 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station) => (
                  <tr key={station.id} className="border-b last:border-0">
                    <td className="p-3">{station.order}</td>
                    <td className="p-3 font-medium">{station.name}</td>
                    <td className="p-3 text-muted-foreground">{station.description || '—'}</td>
                    <td className="p-3">
                      {station.isReward ? (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Đổi thưởng</span>
                      ) : (
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Trò chơi</span>
                      )}
                    </td>
                    <td className="flex gap-1 p-3">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(station)}>
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          if (confirm('Xác nhận xoá trạm này?')) deleteMutation.mutate(station.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Sửa trạm' : 'Tạo trạm mới'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label>Tên trạm</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Mô tả</Label>
              <Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Thứ tự</Label>
              <Input type="number" min={1} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} required />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isReward"
                checked={form.isReward}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, isReward: !!checked }))}
              />
              <Label htmlFor="isReward">Trạm đổi thưởng</Label>
            </div>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStations;
