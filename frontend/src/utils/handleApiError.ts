import axios from 'axios';
import { toast } from 'sonner';

import type { ApiResponse } from '~/types/common';

export const handleApiError = (err: unknown, fallbackMessage = 'Có lỗi xảy ra!') => {
  if (!axios.isAxiosError(err)) {
    toast.error(fallbackMessage);
    return;
  }

  const data = err.response?.data as ApiResponse | undefined;
  if (!data) {
    toast.error(fallbackMessage);
    return;
  }

  if (data.errors?.length) {
    const details = data.errors.map((e) => e.message).join('. ');
    toast.error(details);
    return;
  }

  toast.error(data.message || fallbackMessage);
};
