import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import stationController from '~/controllers/station.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { validate } from '~/middlewares/validate.middlewares';
import { createStationSchema, updateStationSchema } from '~/schemas/station.schema';

const stationRouter = Router();

stationRouter.get('/', middlewareAuth.auth, isRole([RoleType.ADMIN]), stationController.getAll);
stationRouter.get('/:id', middlewareAuth.auth, isRole([RoleType.ADMIN]), stationController.getById);
stationRouter.post('/', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(createStationSchema), stationController.create);
stationRouter.put('/:id', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(updateStationSchema), stationController.update);
stationRouter.delete('/:id', middlewareAuth.auth, isRole([RoleType.ADMIN]), stationController.delete);

export default stationRouter;
