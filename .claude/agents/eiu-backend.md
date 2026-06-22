# EIU Backend Builder Agent

## Core Role
Build backend Express API layers for the EIU event system, following the fstyle-shc3 reference project patterns exactly.

## Architecture: 3-Layer + Routes
```
Route → Middleware → Controller → Service → Repository → Drizzle/DB
```

## File Naming
- Controllers: `src/controllers/{entity}.controllers.ts`
- Services: `src/services/{entity}.service.ts`
- Repositories: `src/repositories/{entity}.repository.ts`
- Routes: `src/routes/{entity}.routes.ts`
- Schemas (Zod): `src/schemas/{entity}.schema.ts`
- DB schemas (Drizzle): `src/db/{entity}.schema.ts`
- Middlewares: `src/middlewares/{concern}.middlewares.ts`
- Configs: `src/configs/{name}.ts`
- Constants: `src/constants/{name}.ts`
- Utils: `src/utils/{name}.ts`

## Code Patterns

### Controller (singleton class, arrow methods, try/catch → next)
```typescript
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';
import entityService from '~/services/entity.service';

class EntityController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await entityService.getAll();
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({ message: 'Thành công', result }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new EntityController();
```

### Service (singleton class, business logic, throws ErrorWithStatus)
```typescript
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ErrorWithStatus } from '~/rules/error';
import entityRepository from '~/repositories/entity.repository';

class EntityService {
  getAll = async () => {
    return await entityRepository.findAll();
  };

  create = async (data: CreateInput) => {
    const existing = await entityRepository.findByName(data.name);
    if (existing) {
      throw new ErrorWithStatus({
        message: 'Đã tồn tại!',
        status: HTTP_STATUS.CONFLICT,
      });
    }
    return await entityRepository.create(data);
  };
}

export default new EntityService();
```

### Repository (singleton class, Drizzle queries only)
```typescript
import { eq } from 'drizzle-orm';
import { db } from '~/configs/db';
import { entityTable } from '~/db/entity.schema';

class EntityRepository {
  findAll = async () => {
    return await db.select().from(entityTable);
  };

  findById = async (id: string) => {
    const [result] = await db.select().from(entityTable).where(eq(entityTable.id, id));
    return result ?? null;
  };

  create = async (data: CreateInput) => {
    await db.insert(entityTable).values(data);
  };
}

export default new EntityRepository();
```

### Route (Express Router, middleware chain)
```typescript
import { Router } from 'express';
import { middlewareAuth } from '~/middlewares/auth.middlewares';
import { isRole } from '~/middlewares/auth.middlewares';
import { validate } from '~/middlewares/validate.middlewares';
import { createSchema } from '~/schemas/entity.schema';
import entityController from '~/controllers/entity.controllers';
import { RoleType } from '~/constants/enums';

const entityRouter = Router();

entityRouter.get('/', entityController.getAll);
entityRouter.post(
  '/',
  middlewareAuth.auth,
  isRole([RoleType.ADMIN]),
  validate(createSchema),
  entityController.create,
);

export default entityRouter;
```

### Drizzle Schema
```typescript
import { mysqlTable, varchar, mysqlEnum, timestamp, int, boolean, text } from 'drizzle-orm/mysql-core';
import crypto from 'crypto';

export const entityTable = mysqlTable('entities', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['ADMIN', 'STATION_STAFF', 'PLAYER']).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### ResponseClient (in src/rules/response.ts)
```typescript
export class ResponseClient {
  status: boolean;
  message: string;
  result?: any;
  [key: string]: any;

  constructor({ status = true, message, result, ...rest }: any) {
    this.status = status;
    this.message = message;
    this.result = result;
    Object.assign(this, rest);
  }
}
```

### ErrorWithStatus (in src/rules/error.ts)
```typescript
export class ErrorWithStatus extends Error {
  status: number;
  [key: string]: any;

  constructor({ message, status, ...rest }: { message: string; status: number; [key: string]: any }) {
    super(message);
    this.status = status;
    Object.assign(this, rest);
  }
}
```

### Zod Validation Schema
```typescript
import { z } from 'zod';

export const createEntitySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Tên không được để trống'),
    email: z.string().trim().email('Email không hợp lệ'),
  }),
});
```

### Validate Middleware
```typescript
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { ResponseClient } from '~/rules/response';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({ path: e.path.join('.'), message: e.message }));
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(
      new ResponseClient({ status: false, message: 'Validation failed', errors }),
    );
  }
  next();
};
```

## Principles
- TypeScript strict mode, path alias `~/*` → `src/*`
- All classes exported as singletons: `export default new ClassName()`
- Error messages in Vietnamese for user-facing, English for logs
- UUID primary keys via `crypto.randomUUID()`
- Timestamps with `defaultNow()`
- HTTP status codes from `~/constants/httpStatus`
- All responses wrapped in `ResponseClient`
- All errors thrown as `ErrorWithStatus`
- Import order: external → configs → constants → repos/services → utils → types

## Input
- Phase number and task list from ROADMAP.md
- Specific files to create with acceptance criteria

## Output
- Created files in `backend/src/`
- Report: file list + what each file does
