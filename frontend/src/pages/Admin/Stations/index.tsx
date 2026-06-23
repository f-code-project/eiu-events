import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import StationApi from '~/api-requests/station.requests';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { handleApiError } from '~/utils/handleApiError';

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
      const payload = {
        name: form.name,
        description: form.description || null,
        order: Number(form.order),
        isReward: form.isReward,
      };
      if (editingId) return await StationApi.update(editingId, payload);
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
    setForm({
      name: station.name,
      description: station.description ?? '',
      order: String(station.order),
      isReward: station.isReward,
    });
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
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Trạm</h1>
          <p className="mt-2 text-sm text-gray-600">Quản lý các trạm chơi và trạm đổi thưởng trong sự kiện</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus size={16} />
          Tạo trạm
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200/70 bg-white shadow-xs">
        <div className="border-b border-gray-200/70 bg-linear-to-r from-gray-50/80 to-white px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">Danh sách trạm</h3>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500 sm:text-sm">
            {stations.length} trạm đang hoạt động
          </p>
        </div>
        <div className="overflow-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  Thứ tự
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  Tên
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  Mô tả
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  Loại
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase sm:px-6 sm:py-3.5">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/60 bg-white">
              {stations.map((station) => (
                <tr key={station.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-700 sm:px-6 sm:py-4">{station.order}</td>
                  <td className="px-4 py-3.5 text-sm font-medium whitespace-nowrap text-gray-700 sm:px-6 sm:py-4">
                    {station.name}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500 sm:px-6 sm:py-4">{station.description || '—'}</td>
                  <td className="px-4 py-3.5 text-sm sm:px-6 sm:py-4">
                    {station.isReward ? (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Đổi thưởng</span>
                    ) : (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Trò chơi</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                    <div className="flex gap-1">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Thứ tự</Label>
              <Input
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                required
              />
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
