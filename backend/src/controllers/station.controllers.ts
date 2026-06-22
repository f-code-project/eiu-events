import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import stationService from '~/services/station.service';

class StationController {
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await stationService.getAll();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await stationService.getById(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await stationService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json(new ResponseClient({ message: 'Tạo trạm thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await stationService.update(req.params.id as string, req.body);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Cập nhật trạm thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await stationService.delete(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Xoá trạm thành công!' }));
    } catch (err) {
      next(err);
    }
  };
}

export default new StationController();
