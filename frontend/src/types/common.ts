export type ApiResponse<T = any> = {
  status: boolean;
  message: string;
  result?: T;
  errors?: Array<{ path: string; message: string }>;
};
