import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import adminController from '~/controllers/admin.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { validate } from '~/middlewares/validate.middlewares';
import { updateScoreSchema } from '~/schemas/admin.schema';

const adminRouter = Router();

adminRouter.get('/dashboard', middlewareAuth.auth, isRole([RoleType.ADMIN]), adminController.getDashboard);
adminRouter.get('/players', middlewareAuth.auth, isRole([RoleType.ADMIN]), adminController.getPlayers);
adminRouter.get('/players/:id', middlewareAuth.auth, isRole([RoleType.ADMIN]), adminController.getPlayerById);
adminRouter.put('/scores/:id', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(updateScoreSchema), adminController.updateScore);
adminRouter.delete('/scores/:id', middlewareAuth.auth, isRole([RoleType.ADMIN]), adminController.deleteScore);

export default adminRouter;
