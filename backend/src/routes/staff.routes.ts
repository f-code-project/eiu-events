import { Router } from 'express';

import { RoleType } from '~/constants/enums';
import staffController from '~/controllers/staff.controllers';
import { isRole, middlewareAuth } from '~/middlewares/auth.middlewares';
import { validate } from '~/middlewares/validate.middlewares';
import { createStaffSchema, updateStaffSchema } from '~/schemas/staff.schema';

const staffRouter = Router();

staffRouter.get('/', middlewareAuth.auth, isRole([RoleType.ADMIN]), staffController.getAll);
staffRouter.get('/:id', middlewareAuth.auth, isRole([RoleType.ADMIN]), staffController.getById);
staffRouter.post('/', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(createStaffSchema), staffController.create);
staffRouter.put('/:id', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(updateStaffSchema), staffController.update);
staffRouter.delete('/:id', middlewareAuth.auth, isRole([RoleType.ADMIN]), staffController.delete);

export default staffRouter;
