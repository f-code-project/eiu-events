export type StaffType = {
  id: string;
  mssv: string;
  role: string;
  createdAt: string;
  stations: Array<{ stationId: string; stationName: string }>;
};

export type CreateStaffInput = {
  mssv: string;
  password: string;
  stationIds: string[];
};

export type UpdateStaffInput = {
  mssv?: string;
  password?: string;
  stationIds?: string[];
};
