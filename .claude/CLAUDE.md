# F-Style SHC3

F-Code recruitment system — Challenge 3 platform for F21 cohort. Full-stack monorepo with separate frontend and backend.

Reference repo: `hoangtuanqn/fcode-web-system-challenge-3`

## Project Structure

```
fstyle-shc3/
├── .claude/                    # Claude Code config & skills
├── .editorconfig               # Editor settings (2-space indent, LF, UTF-8)
├── .prettierrc                 # Prettier config (shared across monorepo)
├── .gitignore
├── docker-compose.yml          # MySQL 8 + phpMyAdmin + Redis 7
├── package.json                # Root workspace (Prettier plugins only)
│
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json           # strict, path alias ~/*, CommonJS target
│   ├── nodemon.json            # tsx runner, watches src + .env
│   ├── drizzle.config.ts        # Drizzle Kit config
│   ├── drizzle/                 # Generated migrations
│   └── src/
│       ├── index.ts            # Express app entry
│       ├── configs/            # env, db, redis, socket
│       ├── db/                 # Drizzle schema files (*.schema.ts)
│       ├── constants/          # enums, httpStatus, barems
│       ├── controllers/        # Request handlers (*.controllers.ts)
│       ├── services/           # Business logic (*.service.ts)
│       ├── repositories/       # Data access layer (*.repository.ts)
│       ├── routes/             # Express routers (*.routes.ts)
│       ├── middlewares/        # auth, error, success handlers
│       ├── schemas/            # Zod validation schemas
│       ├── rules/              # Auth rules & request validation
│       ├── queues/             # BullMQ job queues
│       ├── workers/            # Background job processors
│       ├── seeders/            # DB seed data
│       └── utils/              # Helpers (crypto, JWT, etc.)
│
└── frontend/
    ├── .env.development        # VITE_API_BACKEND_API, VITE_API_BACKEND
    ├── .env.production
    ├── package.json
    ├── tsconfig.json           # strict, path alias ~/*
    ├── tsconfig.app.json       # ES2022 target, react-jsx
    ├── tsconfig.node.json      # ES2023 for Vite config
    ├── vite.config.ts          # React + Tailwind + path alias
    ├── eslint.config.js        # Flat config: JS + TS + React Hooks + Refresh
    ├── components.json         # shadcn/ui: new-york style, lucide icons
    └── src/
        ├── main.tsx            # App entry
        ├── App.tsx             # Root routing
        ├── api-requests/       # API client classes (*.requests.ts)
        ├── assets/             # Images, SVGs
        ├── components/         # Shared components
        │   ├── Header/         # Nav variants (Admin, Candidate)
        │   ├── ui/             # shadcn/ui components
        │   └── ...             # Badge, Breadcrumb, Footer, Loading, etc.
        ├── constants/          # Enums, app constants
        ├── data/               # Static JSON data
        ├── features/           # Redux slices (userSlice, etc.)
        ├── hooks/              # Custom hooks (useAuth, useRedux)
        ├── layout/             # Layout components (MainLayout, ProtectedRoute)
        ├── lib/                # Utilities (cn, utils)
        ├── pages/              # Route pages by role
        │   ├── Home/
        │   ├── Login/
        │   ├── Candidate/
        │   ├── Judge/          # Barem/, Room/
        │   ├── Mentor/         # Barem/
        │   ├── Admin/          # Candidates/, Users/, Rooms/, Reports/
        │   ├── Teams/
        │   ├── Submissions/
        │   └── Present/
        ├── store/              # Redux store config
        ├── styles/             # Global CSS (Tailwind)
        ├── types/              # TypeScript type definitions
        └── utils/              # Helpers (axiosInstance, localStorage)
```

## Tech Stack

### Frontend

- **React 19** + **React Router 7** — SPA with role-based routing
- **Vite 7** — build tool with React plugin + Babel React Compiler
- **TypeScript** — strict mode, path alias `~/*` → `src/*`
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin
- **shadcn/ui** — Radix UI primitives, new-york style, lucide icons
- **Redux Toolkit** — global state (user auth)
- **TanStack React Query** — server state & caching
- **Axios** — HTTP client with interceptors (auto Bearer token, refresh queue)
- **Socket.io-client** — real-time communication
- **Sonner** — toast notifications
- **driver.js** — user onboarding tours
- **clsx + tailwind-merge + cva** — conditional class utilities

### Backend

- **Express 5** — REST API framework
- **TypeScript** — strict mode, path alias `~/*` → `src/*`, CommonJS output
- **Drizzle ORM** — type-safe ORM with MySQL 8
- **Redis 7** — caching + token store
- **BullMQ** — background job queue (email, etc.)
- **Socket.io** — WebSocket server
- **JWT** (jsonwebtoken) + **bcrypt** — authentication
- **Zod** — request validation schemas
- **Nodemailer + Handlebars** — email templates
- **express-rate-limit** — rate limiting

### Infrastructure

- **Docker Compose**: MySQL 8 (port 3306), phpMyAdmin (port 8080), Redis 7 (port 6379)
- **No CI/CD pipelines** — manual deployment
- **No pre-commit hooks** — Prettier run manually

## Architecture

### Backend: 3-Layer + Routes

```
Request → Route → Middleware → Controller → Service → Repository → Drizzle/DB
                                                                  ↓
Response ← Middleware (error/success) ← Controller ← Service ← Repository
```

- **Routes** define endpoints and chain middleware
- **Controllers** handle HTTP request/response
- **Services** contain business logic
- **Repositories** handle Drizzle queries only
- **Middlewares** handle auth verification, error formatting, success wrapping

### Frontend: Pages + Redux + React Query

```
App.tsx (Router)
  → Layout (MainLayout, ProtectedRoute)
    → Page (role-specific)
      → Components (shared UI)
      → Hooks (useAuth, custom)
      → API Requests (Axios classes)
      → Redux Store (global auth state)
      → React Query (server state cache)
```

## Naming Conventions

### Files

| Location             | Convention              | Example               |
| -------------------- | ----------------------- | --------------------- |
| Backend controllers  | `entity.controllers.ts` | `user.controllers.ts` |
| Backend services     | `entity.service.ts`     | `team.service.ts`     |
| Backend repositories | `entity.repository.ts`  | `judge.repository.ts` |
| Backend routes       | `entity.routes.ts`      | `auth.routes.ts`      |
| Frontend pages       | `PascalCase/index.tsx`  | `Login/index.tsx`     |
| Frontend components  | `PascalCase.tsx`        | `NavLink.tsx`         |
| Frontend hooks       | `camelCase.ts`          | `useAuth.ts`          |
| Frontend API         | `entity.requests.ts`    | `auth.requests.ts`    |
| Frontend Redux       | `entitySlice.ts`        | `userSlice.ts`        |
| shadcn/ui            | `kebab-case.tsx`        | `alert-dialog.tsx`    |

### Code

- **Functions/variables**: camelCase — `handleSwitchRole`, `showUserMenu`
- **React components**: PascalCase — `Header`, `ProtectedRoute`
- **Types/interfaces**: PascalCase with suffix — `UserType`, `LoginInput`, `LoginResponse`
- **Enums**: PascalCase name, UPPER_CASE values — `RoleType.CANDIDATE`
- **Constants**: UPPER_CASE — `HTTP_STATUS`, `USER_ROLE`
- **Classes**: PascalCase — `AuthService`, `UserRepository`, `AlgoJwt`

### Imports order

1. External libs (`express`, `react`, `@tanstack/react-query`)
2. Internal configs (`~/configs/*`)
3. Constants (`~/constants/*`)
4. Repositories/Services (`~/repositories/*`, `~/services/*`)
5. Components (`~/components/*`)
6. Hooks (`~/hooks/*`)
7. Utils (`~/utils/*`)
8. Types (at end, `import type`)

## Code Patterns

### Backend route definition

```typescript
router.post("/login", validate(loginSchema), authController.login);
router.get("/get-info", middlewareAuth.auth, authController.getInfo);
router.put(
  "/update",
  middlewareAuth.auth,
  isRole([RoleType.ADMIN]),
  adminController.update,
);
```

### Backend response format

```typescript
return res.status(HTTP_STATUS.OK).json(
  new ResponseClient({
    message: "Đăng nhập thành công!",
    result: { ...user, access_token, refresh_token },
  }),
);
```

### Backend error handling

```typescript
throw new ErrorWithStatus({
  message: "Token không hợp lệ!",
  status: HTTP_STATUS.UNAUTHORIZED,
});
```

### Frontend API client class

```typescript
class AuthApi {
  static login = async ({ email, password, role }: LoginInput) => {
    const response = await privateApi.post<LoginResponse>("/auth/login", {
      email,
      password,
      role,
    });
    return response?.data || [];
  };
}
```

### Frontend Redux slice

```typescript
export const getInfo = createAsyncThunk('user/getInfo', async () => {
  return await AuthApi.getInfo();
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: { setUser: (state, action) => { ... } },
  extraReducers: (builder) => {
    builder.addCase(getInfo.fulfilled, (state, action) => { ... });
  },
});
```

### Frontend Axios interceptor (auto refresh token)

```typescript
privateApi.interceptors.request.use((config) => {
  const token = LocalStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Frontend protected route

```typescript
<Route element={<ProtectedRoute allowedRoles={[RoleType.ADMIN]} />}>
  <Route path="/admin/*" element={<AdminLayout />} />
</Route>
```

## Auth Flow

1. User logs in → backend returns `access_token` + `refresh_token`
2. Tokens stored in localStorage
3. Axios interceptor adds Bearer token to every request
4. On 401 → interceptor queues requests, calls refresh endpoint, retries
5. `ProtectedRoute` component checks user roles before rendering pages
6. Account activation via email link with Redis-stored token (TTL)

## Development

### Setup

```bash
# 1. Root
npm install

# 2. Infrastructure
docker compose up -d

# 3. Backend
cd backend
npm install
cp .env.example .env          # Edit with your values
npx drizzle-kit generate
npx drizzle-kit migrate
npm run dev                    # http://localhost:8000

# 4. Frontend
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

### Environment variables

**Backend** (`.env`):

- `PORT=8000`
- `DATABASE_URL=mysql://root:fstyle_crew@localhost:3306/fstyle_crew`
- `JWT_SECURE` — JWT signing secret
- `REDIS_HOST=localhost`, `REDIS_PORT=6379`
- `CLIENT_URL=http://localhost:5173`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — Gmail SMTP

**Frontend** (`.env.development`):

- `VITE_API_BACKEND_API=http://localhost:8000/api/v1`
- `VITE_API_BACKEND=http://localhost:8000`

### Scripts

| Script          | Location | What it does                           |
| --------------- | -------- | -------------------------------------- |
| `npm run dev`   | frontend | Start Vite dev server                  |
| `npm run build` | frontend | TypeScript check + Vite build          |
| `npm run lint`  | frontend | ESLint check                           |
| `npm run dev`   | backend  | Nodemon with tsx (auto-reload)         |
| `npm run build` | backend  | `tsc && tsc-alias`                     |
| `npm start`     | backend  | Production mode (`node dist/index.js`) |

### Path aliases

Both frontend and backend use `~/*` → `src/*`:

```typescript
import { RoleType } from "~/constants/enums";
import userRepository from "~/repositories/user.repository";
```

## Formatting

- **Prettier**: 120 char width, 2-space indent, single quotes, trailing commas, semicolons
- **Plugins**: `prettier-plugin-organize-imports`, `prettier-plugin-jsdoc`, `prettier-plugin-tailwindcss` (frontend)
- **EditorConfig**: 2 spaces, LF line endings, UTF-8, trim trailing whitespace

## User Roles

System supports 4 roles with role-based routing:

- **Admin (BTC F-Code)** — full system access: nhập điểm BGK, nhập giải thưởng, xem leaderboard + bảng thống kê, quản lý accounts
- **BTC FStyle** — vote Nỗ lực (xuyên suốt các team), nhập giải thưởng thủ công, xem leaderboard
- **MC** — xem leaderboard only
- **Thành viên (4 đội thi)** — vote Giải Nỗ lực (trong team mình)

> Không có đăng ký tự do — tất cả account do Admin (BTC F-Code) cấp.

## Domain Docs

Tài liệu nghiệp vụ nằm trong `/docs`. Đọc khi cần context về event rules, scoring, members, awards.

| File                                                          | Nội dung                                                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`docs/FSTYLE_SHOWCASE.md`](../docs/FSTYLE_SHOWCASE.md)       | Tài liệu hệ thống tổng quan: timeline, roles, voting rules, scoring, leaderboard, kỹ thuật |
| [`docs/SCORING_CRITERIA.md`](../docs/SCORING_CRITERIA.md)     | Tiêu chí chấm điểm BGK — 6 hạng mục, tổng 100đ                                             |
| [`docs/AWARD.md`](../docs/AWARD.md)                           | Cơ cấu giải thưởng: 10 giải, cách tính điểm, lưu ý                                         |
| [`docs/MEMBERS.md`](../docs/MEMBERS.md)                       | Danh sách 4 team (42 thành viên) + BTC FStyle (4) + BTC F-Code (2), kèm email              |
| [`docs/TASK_FRONTEND_DONE.md`](../docs/TASK_FRONTEND_DONE.md) | Spec landing page (đã build) — components, hooks, CSS tokens, asset mapping                |

### Key Domain Rules (from docs)

- **Voting period**: 29/6/2026 → 23:59 ngày 3/7/2026
- **Showcase night**: 5/7/2026, 18:00, Hall A — FPT University HCM
- **4 teams**: SHIRO KURO (10), Apex Aura (11), SLATT (11), ANTI-X (10)
- **Scoring**: 3 BGK × 100đ/team → trung bình → xếp hạng tự động (Quán quân / Á quân / Khuyến khích)
- **Giải Nỗ lực**: 40% vote thành viên + 30% BTC + 30% chuyên cần → BTC tự tính → nhập kết quả
- **Giải Yêu thích**: 50% vote online fanpage + 50% vote trực tiếp → BTC FStyle nhập tay
- **Giải Kỹ thuật/Biên đạo/Phong cách/Trưởng nhóm**: BTC nhập tay
- **Realtime**: Socket.io push khi BTC nhập giải → leaderboard cập nhật tất cả client

## Harness: Landing Page Builder

**Goal:** Build Heatwave SHC3 APOCALYPSE landing page with parallel sub-agents from TASK.md specs.

**Trigger:** Landing page build/rebuild requests → use `build-landing-page` skill. Simple questions about components → answer directly.

**Change Log:**
| Date | Change | Target | Reason |
|------|--------|--------|--------|
| 2026-06-20 | Initial build | All | New harness for landing page |
