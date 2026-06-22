import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import adminService from '~/services/admin.service';

class AdminController {
  getDashboard = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await adminService.getDashboard();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getPlayers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await adminService.getPlayers();
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getPlayerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await adminService.getPlayerById(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  updateScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.updateScore(req.params.id as string, req.body.score);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Cập nhật điểm thành công!' }));
    } catch (err) {
      next(err);
    }
  };

  deleteScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await adminService.deleteScore(req.params.id as string);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Xoá điểm thành công!' }));
    } catch (err) {
      next(err);
    }
  };
}

export default new AdminController();
