import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import scoreService from '~/services/score.service';

class ScoreController {
  getMyStations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scoreService.getMyStations(req.userId!);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scoreService.create(req.userId!, req.body);
      res.status(HTTP_STATUS.CREATED).json(new ResponseClient({ message: 'Chấm điểm thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  getByStation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await scoreService.getByStation(req.userId!, req.params.stationId);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new ScoreController();
