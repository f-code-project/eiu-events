import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import rewardController from '~/controllers/reward.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';

const rewardRouter = Router();

rewardRouter.get('/pending', middlewareAuth.auth, isRole([RoleType.STATION_STAFF]), rewardController.getPending);
rewardRouter.put('/:id/complete', middlewareAuth.auth, isRole([RoleType.STATION_STAFF]), rewardController.complete);

export default rewardRouter;
