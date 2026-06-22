# Backend Patterns

## Express App Setup

Entry point `src/index.ts`:
```typescript
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : process.env.CLIENT_URL,
  credentials: true,
}));

// Socket.io
initSocket(server);

// Redis
redisClient.connect();

// Routes — all under /api/v1
app.use('/api/v1', rootRouter);

// Error handling (must be last)
app.use(defaultErrorHandler);
app.use(defaultSuccessHandler);

server.listen(PORT);
```

## Route Definition

```typescript
import { Router } from 'express';
import { middlewareAuth } from '~/middlewares/auth.middlewares';
import { isRole } from '~/middlewares/auth.middlewares';
import { validate } from '~/schemas/validate';
import { createSchema } from '~/schemas/some.schema';
import someController from '~/controllers/some.controllers';

const someRouter = Router();

// Public
someRouter.get('/', someController.getAll);

// Auth required
someRouter.get('/:id', middlewareAuth.auth, someController.getById);

// Auth + role + validation
someRouter.post(
  '/',
  middlewareAuth.auth,
  isRole([RoleType.ADMIN]),
  validate(createSchema),
  someController.create,
);

export default someRouter;
```

Register in `root.routes.ts`:
```typescript
rootRouter.use('/some', someRouter);
```

## Controller Pattern

```typescript
class SomeController {
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await someService.getAll();
      res.status(HTTP_STATUS.OK).json(
        new ResponseClient({ message: 'Thành công', result }),
      );
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await someService.create(req.body);
      res.status(HTTP_STATUS.CREATED).json(
        new ResponseClient({ message: 'Tạo thành công', result }),
      );
    } catch (err) {
      next(err);
    }
  };
}

export default new SomeController();
```

## Service Pattern

```typescript
class SomeService {
  getAll = async () => {
    return await someRepository.findAll();
  };

  create = async (data: CreateInput) => {
    const existing = await someRepository.findByName(data.name);
    if (existing) {
      throw new ErrorWithStatus({
        message: 'Đã tồn tại!',
        status: HTTP_STATUS.CONFLICT,
      });
    }
    return await someRepository.create(data);
  };
}

export default new SomeService();
```

## Repository Pattern

```typescript
import { eq } from 'drizzle-orm';
import { db } from '~/configs/db';
import { someTable } from '~/db/some.schema';

class SomeRepository {
  findAll = async () => {
    return await db.select().from(someTable);
  };

  findById = async (id: string) => {
    const [result] = await db.select().from(someTable).where(eq(someTable.id, id));
    return result ?? null;
  };

  create = async (data: CreateInput) => {
    await db.insert(someTable).values(data);
  };

  update = async (id: string, data: UpdateInput) => {
    await db.update(someTable).set(data).where(eq(someTable.id, id));
  };

  delete = async (id: string) => {
    await db.delete(someTable).where(eq(someTable.id, id));
  };
}

export default new SomeRepository();
```

## Zod Validation

```typescript
import { z } from 'zod';

export const createSomeSchema = z.object({
  body: z.object({
    name: z.string().trim().nonempty('Tên không được để trống'),
    email: z.string().trim().email('Email không hợp lệ'),
    role: z.enum(['CANDIDATE', 'MENTOR', 'JUDGE', 'ADMIN']).optional(),
  }),
});
```

Validate middleware wraps Zod parse and passes errors to `next()`.

## Auth Middleware

```typescript
// Verify JWT token
middlewareAuth.auth  // extracts user from Bearer token, attaches to req

// Check role permission
isRole([RoleType.ADMIN, RoleType.JUDGE])  // 403 if user lacks required role

// Verify activation token (Redis-backed)
middlewareAuth.verifyTokenActiveAccount
middlewareAuth.isExsitedTokenInRedis
```

## JWT Token Pattern

- Access token: short-lived, sent in Authorization header
- Refresh token: longer-lived, stored in Redis for validation
- Token generation via `AlgoJwt` utility class
- Password hashing via `bcrypt` with salt rounds

## Email Queue (BullMQ)

```typescript
// Queue definition
const emailQueue = new Queue('email', { connection: redisConnection });

// Add job
await emailQueue.add('send-activation', { to, subject, template, data });

// Worker processes jobs
const emailWorker = new Worker('email', async (job) => {
  const { to, subject, template, data } = job.data;
  const html = handlebars.compile(template)(data);
  await transporter.sendMail({ to, subject, html });
}, { connection: redisConnection });
```

## Drizzle Config

- Schema files: `src/db/schema.ts` (TypeScript table definitions)
- Config: `drizzle.config.ts` at backend root
- DB client singleton in `src/configs/db.ts` (mysql2 + drizzle-orm)
- Migrations in `drizzle/` (generated by drizzle-kit)
- After schema change: `npx drizzle-kit generate` + `npx drizzle-kit migrate`
- Studio: `npx drizzle-kit studio` (GUI at https://local.drizzle.studio)
