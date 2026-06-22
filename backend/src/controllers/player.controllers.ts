import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import playerService from '~/services/player.service';

class PlayerController {
  getProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await playerService.getProgress(req.userId!);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  requestReward = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await playerService.requestReward(req.userId!);
      res.status(HTTP_STATUS.CREATED).json(new ResponseClient({ message: 'Gửi yêu cầu thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new PlayerController();
