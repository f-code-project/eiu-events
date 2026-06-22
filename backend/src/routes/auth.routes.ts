import { Router } from 'express';

import authController from '~/controllers/auth.controllers';
import { middlewareAuth } from '~/middlewares/auth.middlewares';
import { validate } from '~/middlewares/validate.middlewares';
import { loginSchema, registerSchema } from '~/schemas/auth.schema';

const authRouter = Router();

authRouter.post('/register', validate(registerSchema), authController.register);
authRouter.post('/login', validate(loginSchema), authController.login);
authRouter.get('/me', middlewareAuth.auth, authController.getInfo);
authRouter.post('/refresh', authController.refreshToken);
authRouter.post('/logout', middlewareAuth.auth, authController.logout);

export default authRouter;
