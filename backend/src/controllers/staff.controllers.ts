import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import staffService from '~/services/staff.service';

class StaffController {
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await staffService.getAll();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await staffService.getById(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await staffService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json(new ResponseClient({ message: 'Tạo nhân sự thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await staffService.update(req.params.id as string, req.body);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Cập nhật nhân sự thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await staffService.delete(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Xoá nhân sự thành công!' }));
    } catch (err) {
      next(err);
    }
  };
}

export default new StaffController();
