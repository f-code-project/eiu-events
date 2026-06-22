import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import scoreController from '~/controllers/score.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { validate } from '~/middlewares/validate.middlewares';
import { createScoreSchema } from '~/schemas/score.schema';

const scoreRouter = Router();

scoreRouter.post(
  '/',
  middlewareAuth.auth,
  isRole([RoleType.STATION_STAFF]),
  validate(createScoreSchema),
  scoreController.create,
);

scoreRouter.get(
  '/station/:stationId',
  middlewareAuth.auth,
  isRole([RoleType.STATION_STAFF]),
  scoreController.getByStation,
);

export default scoreRouter;
