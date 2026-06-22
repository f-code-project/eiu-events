import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import StaffApi from '~/api-requests/staff.requests';
import StationApi from '~/api-requests/station.requests';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

import type { StaffType } from '~/types/staff';

type FormState = { mssv: string; password: string; stationIds: string[] };
const emptyForm: FormState = { mssv: '', password: '', stationIds: [] };

const AdminStaff = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const { data: staffData, isLoading: loadingStaff } = useQuery({
    queryKey: ['admin-staff'],
    queryFn: StaffApi.getAll,
  });

  const { data: stationsData } = useQuery({
    queryKey: ['admin-stations'],
    queryFn: StationApi.getAll,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const payload: any = { stationIds: form.stationIds };
        if (form.mssv) payload.mssv = form.mssv;
        if (form.password) payload.password = form.password;
        return await StaffApi.update(editingId, payload);
      }
      return await StaffApi.create(form);
    },
    onSuccess: () => {
      toast.success(editingId ? 'Cập nhật thành công!' : 'Tạo nhân sự thành công!');
      closeDialog();
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: StaffApi.delete,
    onSuccess: () => {
      toast.success('Xoá nhân sự thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin-staff'] });
    },
    onError: (err) => {
      if (axios.isAxiosError(err)) toast.error(err.response?.data?.message || 'Có lỗi xảy ra!');
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (staff: StaffType) => {
    setEditingId(staff.id);
    setForm({ mssv: staff.mssv, password: '', stationIds: staff.stations.map((s) => s.stationId) });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const toggleStation = (stationId: string) => {
    setForm((f) => ({
      ...f,
      stationIds: f.stationIds.includes(stationId) ? f.stationIds.filter((id) => id !== stationId) : [...f.stationIds, stationId],
    }));
  };

  if (loadingStaff) return <Loading />;

  const staffList = staffData?.result ?? [];
  const stationList = stationsData?.result ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Quản lý nhân sự</h2>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus size={16} />
          Tạo nhân sự
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-3 font-medium">MSSV</th>
                  <th className="p-3 font-medium">Trạm phụ trách</th>
                  <th className="p-3 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-b last:border-0">
                    <td className="p-3 font-mono font-medium">{staff.mssv}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {staff.stations.map((s) => (
                          <span key={s.stationId} className="rounded bg-gray-100 px-2 py-0.5 text-xs">
                            {s.stationName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="flex gap-1 p-3">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(staff)}>
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          if (confirm('Xác nhận xoá nhân sự này?')) deleteMutation.mutate(staff.id);
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
            <DialogTitle>{editingId ? 'Sửa nhân sự' : 'Tạo nhân sự mới'}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label>MSSV</Label>
              <Input value={form.mssv} onChange={(e) => setForm((f) => ({ ...f, mssv: e.target.value }))} required={!editingId} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{editingId ? 'Mật khẩu mới (bỏ trống nếu không đổi)' : 'Mật khẩu'}</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required={!editingId}
                minLength={6}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Trạm phụ trách</Label>
              <div className="flex flex-col gap-2 rounded border p-3">
                {stationList.map((station) => (
                  <div key={station.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`station-${station.id}`}
                      checked={form.stationIds.includes(station.id)}
                      onCheckedChange={() => toggleStation(station.id)}
                    />
                    <Label htmlFor={`station-${station.id}`} className="cursor-pointer">
                      {station.name}
                      {station.isReward && <span className="ml-1 text-xs text-amber-600">(Đổi thưởng)</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={saveMutation.isPending || form.stationIds.length === 0}>
              {saveMutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStaff;
