import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import rewardService from '~/services/reward.service';

class RewardController {
  getPending = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await rewardService.getPending(req.userId!);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công!', result }));
    } catch (err) {
      next(err);
    }
  };

  complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await rewardService.complete(req.params.id as string, req.userId!);
      res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Trao thưởng thành công!', result }));
    } catch (err) {
      next(err);
    }
  };
}

export default new RewardController();
