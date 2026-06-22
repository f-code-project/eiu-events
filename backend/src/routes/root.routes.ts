import { Router } from 'express';

import adminRouter from '~/routes/admin.routes';
import authRouter from '~/routes/auth.routes';
import playerRouter from '~/routes/player.routes';
import rewardRouter from '~/routes/reward.routes';
import scoreRouter from '~/routes/score.routes';
import staffRouter from '~/routes/staff.routes';
import stationRouter from '~/routes/station.routes';

const rootRouter = Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/stations', stationRouter);
rootRouter.use('/staff', staffRouter);
rootRouter.use('/scores', scoreRouter);
rootRouter.use('/players', playerRouter);
rootRouter.use('/rewards', rewardRouter);
rootRouter.use('/admin', adminRouter);

export default rootRouter;
