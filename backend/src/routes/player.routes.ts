import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import playerController from '~/controllers/player.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';

const playerRouter = Router();

playerRouter.get('/progress', middlewareAuth.auth, isRole([RoleType.PLAYER]), playerController.getProgress);
playerRouter.post('/request-reward', middlewareAuth.auth, isRole([RoleType.PLAYER]), playerController.requestReward);

export default playerRouter;
