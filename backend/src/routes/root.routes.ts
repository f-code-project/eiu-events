import { Router } from 'express';

import authRouter from '~/routes/auth.routes';
import staffRouter from '~/routes/staff.routes';
import stationRouter from '~/routes/station.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/stations', stationRouter);
rootRouter.use('/staff', staffRouter);

export default rootRouter;
