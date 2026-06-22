import { privateApi } from '~/utils/axiosInstance';

import type { ApiResponse } from '~/types/common';
import type { CreateStaffInput, StaffType, UpdateStaffInput } from '~/types/staff';

class StaffApi {
  static getAll = async () => {
    const response = await privateApi.get<ApiResponse<StaffType[]>>('/staff');
    return response.data;
  };

  static create = async (data: CreateStaffInput) => {
    const response = await privateApi.post<ApiResponse<StaffType>>('/staff', data);
    return response.data;
  };

  static update = async (id: string, data: UpdateStaffInput) => {
    const response = await privateApi.put<ApiResponse<StaffType>>(`/staff/${id}`, data);
    return response.data;
  };

  static delete = async (id: string) => {
    const response = await privateApi.delete<ApiResponse>(`/staff/${id}`);
    return response.data;
  };
}

export default StaffApi;
