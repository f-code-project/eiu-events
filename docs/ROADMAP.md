# EIU — Roadmap phát triển

> Tài liệu hướng dẫn thứ tự phát triển hệ thống Exploring IT Universe (EIU).
> Đọc kèm: [`docs/EIU.md`](./EIU.md) — spec nghiệp vụ chi tiết.

---

## Tổng quan Phases

```
Phase 0: Backend Setup
    │
Phase 1: Database Schema
    │
Phase 2: Auth Module
    ├──────────────┬──────────────┐
Phase 3           Phase 4        Phase 5
Admin CRUD        Staff Scoring  Player Progress
Station & Staff                  & Reward + Socket.io
    │              │              │
    └──────────────┴──────────────┘
                   │
             Phase 6: Admin Dashboard
                   │
             Phase 7: Frontend Auth
                   │
         ┌─────────┼─────────┐
    Phase 8     Phase 9     Phase 10
    Player UI   Staff UI    Admin UI
```

| Phase | Tên | Depends on | Ước lượng |
|-------|-----|-----------|-----------|
| 0 | Backend Project Setup | — | 0.5 ngày |
| 1 | Database Schema | Phase 0 | 0.5 ngày |
| 2 | Auth Module | Phase 1 | 1 ngày |
| 3 | Admin — Station & Staff CRUD | Phase 2 | 1 ngày |
| 4 | Staff — Scoring API | Phase 2 | 0.5 ngày |
| 5 | Player — Progress & Reward + Socket.io | Phase 2 | 1 ngày |
| 6 | Admin — Dashboard & Player Management | Phase 3, 4, 5 | 0.5 ngày |
| 7 | Frontend — Auth + Base Setup | Phase 2 | 1 ngày |
| 8 | Frontend — Player UI | Phase 5, 7 | 1 ngày |
| 9 | Frontend — Staff UI | Phase 4, 5, 7 | 1 ngày |
| 10 | Frontend — Admin UI | Phase 6, 7 | 1.5 ngày |

**Tổng ước lượng: ~9 ngày** (1 dev full-stack)

---

## Phase 0: Backend Project Setup

**Mục tiêu:** Khởi tạo backend TypeScript với Express, Drizzle ORM, Redis client, cấu trúc thư mục chuẩn.

### Tasks

| # | Task | File/Output | Acceptance Criteria |
|---|------|-------------|---------------------|
| 0.1 | Install dependencies | `backend/package.json` | express, drizzle-orm, mysql2, ioredis, jsonwebtoken, bcrypt, zod, dotenv, cors, cookie-parser, socket.io, bullmq, nodemailer, handlebars |
| 0.2 | Install devDependencies | `backend/package.json` | typescript, tsx, nodemon, tsc-alias, drizzle-kit, @types/* |
| 0.3 | Config TypeScript | `backend/tsconfig.json` | strict mode, path alias `~/*` → `src/*`, CommonJS target |
| 0.4 | Config Nodemon | `backend/nodemon.json` | tsx runner, watch `src/` + `.env` |
| 0.5 | Config Drizzle | `backend/drizzle.config.ts` | MySQL provider, schema path, migration output |
| 0.6 | Tạo cấu trúc thư mục | `backend/src/` | configs/, controllers/, services/, repositories/, routes/, middlewares/, schemas/, db/, constants/, utils/, queues/, workers/ |
| 0.7 | Express app entry | `backend/src/index.ts` | Express + CORS + cookieParser + JSON parser + error handler + listen port 8000 |
| 0.8 | DB connection | `backend/src/configs/db.ts` | Drizzle + mysql2 pool, đọc từ `DATABASE_URL` |
| 0.9 | Redis client | `backend/src/configs/redis.ts` | ioredis connect, đọc từ `REDIS_HOST` + `REDIS_PORT` |
| 0.10 | Environment template | `backend/.env.example` | PORT, DATABASE_URL, JWT_SECURE, REDIS_HOST, REDIS_PORT, CLIENT_URL |
| 0.11 | Constants | `backend/src/constants/` | `httpStatus.ts` (HTTP status codes), `enums.ts` (RoleType: ADMIN, STATION_STAFF, PLAYER) |
| 0.12 | Response wrapper | `backend/src/utils/ResponseClient.ts` | Class `ResponseClient({ status, message, result, errors })` |
| 0.13 | Error class | `backend/src/utils/ErrorWithStatus.ts` | Class `ErrorWithStatus({ message, status })` extends Error |
| 0.14 | Error handler middleware | `backend/src/middlewares/error.middlewares.ts` | Catch all errors → format as `ResponseClient` |
| 0.15 | Root router | `backend/src/routes/root.routes.ts` | Mount point `/api/v1`, export `rootRouter` |
| 0.16 | npm scripts | `backend/package.json` | `dev`: nodemon, `build`: tsc + tsc-alias, `start`: node dist/index.js |

### Kiểm tra hoàn thành Phase 0

- [ ] `npm run dev` → server listen port 8000
- [ ] `GET /api/v1` → trả về response (có thể 404, nhưng server không crash)
- [ ] Redis connect thành công (log)
- [ ] DB connect thành công (log)

---

## Phase 1: Database Schema

**Mục tiêu:** Thiết kế và tạo 5 bảng chính bằng Drizzle ORM.

### ERD

```
┌──────────────┐       ┌───────────────────┐       ┌──────────────┐
│    users     │       │   station_staff   │       │   stations   │
├──────────────┤       ├───────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)           │    ┌──│ id (PK)      │
│ mssv (UQ)    │  ├───>│ user_id (FK)      │    │  │ name         │
│ password     │  │    │ station_id (FK)   │<───┘  │ description  │
│ role         │  │    │ created_at        │       │ order        │
│ reward_status│  │    └───────────────────┘       │ is_reward    │
│ created_at   │  │                                │ created_at   │
└──────────────┘  │    ┌───────────────────┐       └──────────────┘
                  │    │      scores       │              │
                  │    ├───────────────────┤              │
                  ├───>│ player_id (FK)    │              │
                  │    │ station_id (FK)   │<─────────────┘
                  │    │ score (1-3)       │
                  │    │ staff_id (FK)     │<───── user (staff)
                  │    │ created_at        │
                  │    └───────────────────┘
                  │
                  │    ┌───────────────────┐
                  │    │  reward_requests  │
                  │    ├───────────────────┤
                  └───>│ player_id (FK)    │
                       │ status            │ ← PENDING / COMPLETED
                       │ processed_by (FK) │ ← user (staff đổi thưởng)
                       │ total_score       │
                       │ created_at        │
                       │ processed_at      │
                       └───────────────────┘
```

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 1.1 | Schema `users` | `src/db/users.schema.ts` | id (UUID), mssv (varchar, unique), password (varchar), role (enum: ADMIN, STATION_STAFF, PLAYER), reward_status (enum: NONE, PENDING, COMPLETED), created_at |
| 1.2 | Schema `stations` | `src/db/stations.schema.ts` | id (UUID), name (varchar), description (text, nullable), order (int), is_reward (boolean, default false), created_at |
| 1.3 | Schema `station_staff` | `src/db/station-staff.schema.ts` | id (UUID), user_id (FK → users), station_id (FK → stations), created_at |
| 1.4 | Schema `scores` | `src/db/scores.schema.ts` | id (UUID), player_id (FK → users), station_id (FK → stations), score (int, 1-3), staff_id (FK → users), created_at |
| 1.5 | Schema `reward_requests` | `src/db/reward-requests.schema.ts` | id (UUID), player_id (FK → users), status (enum: PENDING, COMPLETED), processed_by (FK → users, nullable), total_score (int), created_at, processed_at (nullable) |
| 1.6 | Export barrel | `src/db/schema.ts` | Re-export tất cả schema |
| 1.7 | Generate migration | `drizzle/` | `npx drizzle-kit generate` |
| 1.8 | Run migration | — | `npx drizzle-kit migrate` |

### Kiểm tra hoàn thành Phase 1

- [ ] 5 bảng tồn tại trong MySQL (kiểm tra qua phpMyAdmin)
- [ ] Foreign keys đúng
- [ ] Unique constraint trên `users.mssv`
- [ ] `npx drizzle-kit studio` → xem được schema

---

## Phase 2: Auth Module

**Mục tiêu:** Register, Login, JWT token, auth middleware, role middleware.

### Endpoints

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| POST | `/api/v1/auth/register` | — | `{ mssv, password, confirmPassword }` | `{ message, result: { id, mssv } }` |
| POST | `/api/v1/auth/login` | — | `{ mssv, password }` | `{ message, result: { access_token, refresh_token, user } }` |
| POST | `/api/v1/auth/refresh-token` | — | `{ refresh_token }` | `{ message, result: { access_token } }` |
| GET | `/api/v1/auth/me` | Bearer | — | `{ message, result: user }` |
| POST | `/api/v1/auth/logout` | Bearer | — | `{ message }` |

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 2.1 | JWT utility | `src/utils/jwt.ts` | sign, verify access_token + refresh_token. Secret từ `JWT_SECURE` env |
| 2.2 | Password utility | `src/utils/password.ts` | hash + compare bằng bcrypt |
| 2.3 | Zod schemas | `src/schemas/auth.schema.ts` | `registerSchema` (mssv: string, password: min 6, confirmPassword: match), `loginSchema` (mssv, password) |
| 2.4 | Validate middleware | `src/middlewares/validate.middlewares.ts` | Nhận Zod schema → parse req → trả lỗi 422 nếu invalid |
| 2.5 | Auth repository | `src/repositories/auth.repository.ts` | findByMssv, create |
| 2.6 | Auth service | `src/services/auth.service.ts` | register (check duplicate mssv → hash password → create), login (verify mssv + password → generate tokens → store refresh in Redis) |
| 2.7 | Auth controller | `src/controllers/auth.controllers.ts` | Wrap service calls → ResponseClient |
| 2.8 | Auth routes | `src/routes/auth.routes.ts` | Mount endpoints trên |
| 2.9 | Auth middleware | `src/middlewares/auth.middlewares.ts` | `auth`: verify Bearer token → attach user to req. `isRole([...])`: check user role → 403 |
| 2.10 | Register route | `root.routes.ts` | `rootRouter.use('/auth', authRouter)` |
| 2.11 | Seed admin account | `src/seeders/admin.seed.ts` | Tạo 1 admin account mặc định (MSSV: admin, password: từ env) |

### Kiểm tra hoàn thành Phase 2

- [ ] Register → tạo user với role PLAYER, mssv unique
- [ ] Register trùng MSSV → 409 Conflict
- [ ] Login → trả access_token + refresh_token
- [ ] Login sai password → 401
- [ ] `GET /auth/me` với Bearer token → trả user info
- [ ] `GET /auth/me` không token → 401
- [ ] Refresh token → trả access_token mới
- [ ] Logout → xoá refresh token khỏi Redis
- [ ] Admin seed chạy được

---

## Phase 3: Admin — Station & Staff CRUD

**Mục tiêu:** Admin quản lý trạm (dynamic) và tài khoản nhân sự trực trạm.

### Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/api/v1/stations` | Admin | Danh sách trạm |
| POST | `/api/v1/stations` | Admin | Tạo trạm mới |
| PUT | `/api/v1/stations/:id` | Admin | Sửa trạm |
| DELETE | `/api/v1/stations/:id` | Admin | Xoá trạm (nếu chưa có score) |
| GET | `/api/v1/staff` | Admin | Danh sách nhân sự |
| POST | `/api/v1/staff` | Admin | Tạo tài khoản nhân sự (MSSV + password + assigned stations) |
| PUT | `/api/v1/staff/:id` | Admin | Sửa thông tin + đổi trạm phân quyền |
| DELETE | `/api/v1/staff/:id` | Admin | Xoá nhân sự |

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 3.1 | Station Zod schemas | `src/schemas/station.schema.ts` | createStationSchema (name, description?, order, is_reward), updateStationSchema |
| 3.2 | Station repository | `src/repositories/station.repository.ts` | findAll, findById, create, update, delete |
| 3.3 | Station service | `src/services/station.service.ts` | CRUD + validate (không xoá trạm đã có score) |
| 3.4 | Station controller | `src/controllers/station.controllers.ts` | Wrap service |
| 3.5 | Station routes | `src/routes/station.routes.ts` | Tất cả require Admin role |
| 3.6 | Staff Zod schemas | `src/schemas/staff.schema.ts` | createStaffSchema (mssv, password, station_ids[]), updateStaffSchema |
| 3.7 | Staff repository | `src/repositories/staff.repository.ts` | findAll (join station_staff + stations), create + assign stations, update, delete |
| 3.8 | Staff service | `src/services/staff.service.ts` | CRUD + tạo user role STATION_STAFF + gán station_staff records |
| 3.9 | Staff controller | `src/controllers/staff.controllers.ts` | Wrap service |
| 3.10 | Staff routes | `src/routes/staff.routes.ts` | Tất cả require Admin role |
| 3.11 | Register routes | `root.routes.ts` | Mount `/stations` + `/staff` |

### Kiểm tra hoàn thành Phase 3

- [ ] Admin CRUD station — tạo/sửa/xoá thành công
- [ ] Xoá station đã có score → 400 Bad Request
- [ ] Admin tạo staff → user role STATION_STAFF + station_staff records
- [ ] Staff chỉ thấy trạm mình được phân quyền
- [ ] Non-admin gọi API → 403

---

## Phase 4: Staff — Scoring API

**Mục tiêu:** Nhân sự trực trạm cộng điểm cho người chơi.

### Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| POST | `/api/v1/scores` | Staff | Cộng điểm: `{ mssv, station_id, score }` |
| GET | `/api/v1/scores/station/:stationId` | Staff | Danh sách người đã chấm điểm tại trạm |

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 4.1 | Score Zod schemas | `src/schemas/score.schema.ts` | createScoreSchema (mssv: string, station_id: uuid, score: 1\|2\|3) |
| 4.2 | Score repository | `src/repositories/score.repository.ts` | create, findByPlayerAndStation, findByStation, getTotalScoreByPlayer |
| 4.3 | Score service | `src/services/score.service.ts` | Validate: (1) staff được phân quyền tại station_id, (2) player tồn tại, (3) player chưa có điểm tại trạm này, (4) score 1-3 → insert |
| 4.4 | Score controller | `src/controllers/score.controllers.ts` | Wrap service |
| 4.5 | Score routes | `src/routes/score.routes.ts` | Require STATION_STAFF role |
| 4.6 | Register routes | `root.routes.ts` | Mount `/scores` |

### Business Rules (trong service)

```
1. Staff chỉ cộng điểm tại trạm mình được phân quyền
   → Kiểm tra station_staff record (user_id + station_id)
   → Nếu không có → 403 "Bạn không có quyền chấm điểm tại trạm này"

2. Mỗi người chơi chỉ tính điểm 1 lần/trạm
   → Kiểm tra scores table (player_id + station_id)
   → Nếu đã có → 409 "Người chơi đã được chấm điểm tại trạm này"

3. Điểm phải là 1, 2, hoặc 3
   → Zod validate

4. MSSV phải tồn tại và role = PLAYER
   → Kiểm tra users table
   → Nếu không tìm thấy → 404 "Không tìm thấy người chơi"
```

### Kiểm tra hoàn thành Phase 4

- [ ] Staff cộng điểm cho player → thành công, score record tạo
- [ ] Staff cộng điểm trạm không được phân quyền → 403
- [ ] Cộng điểm lặp cùng trạm → 409
- [ ] MSSV không tồn tại → 404
- [ ] Điểm ngoài 1-3 → 422

---

## Phase 5: Player — Progress & Reward + Socket.io

**Mục tiêu:** Người chơi xem tiến trình, yêu cầu đổi thưởng. Realtime notification tới Trạm Đổi Thưởng.

### Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/api/v1/players/progress` | Player | Tiến trình: danh sách trạm + điểm + tổng điểm + trạng thái reward |
| POST | `/api/v1/players/request-reward` | Player | Yêu cầu đổi thưởng |

### Socket.io Events

| Event | Direction | Data | Mô tả |
|-------|-----------|------|-------|
| `reward:request` | Server → Reward Station | `{ mssv, totalScore, requestedAt }` | Thông báo có người yêu cầu đổi thưởng |
| `reward:completed` | Server → Player | `{ message }` | Thông báo đã được trao thưởng |

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 5.1 | Socket.io setup | `src/configs/socket.ts` | Init Socket.io server, auth middleware (verify JWT từ handshake), join room theo role |
| 5.2 | Player repository | `src/repositories/player.repository.ts` | getProgress (join scores + stations), getRewardStatus |
| 5.3 | Player service | `src/services/player.service.ts` | getProgress: trả danh sách trạm + điểm + tổng. requestReward: validate đủ 7 trạm + chưa nhận thưởng → tạo reward_request + emit socket |
| 5.4 | Player controller | `src/controllers/player.controllers.ts` | Wrap service |
| 5.5 | Player routes | `src/routes/player.routes.ts` | Require PLAYER role |
| 5.6 | Reward service bổ sung | `src/services/reward.service.ts` | processReward: staff đánh dấu đã trao thưởng → update reward_request + user.reward_status → emit socket tới player |
| 5.7 | Reward controller | `src/controllers/reward.controllers.ts` | Wrap service |
| 5.8 | Reward routes | `src/routes/reward.routes.ts` | `GET /rewards/pending` (Staff, trạm đổi thưởng), `PUT /rewards/:id/complete` (Staff) |
| 5.9 | Register routes | `root.routes.ts` | Mount `/players` + `/rewards` |

### Business Rules

```
request-reward:
1. Player phải có điểm tại TẤT CẢ trạm (trừ trạm đổi thưởng)
   → Count distinct station_id trong scores = tổng station (where is_reward = false)
   → Nếu chưa đủ → 400 "Bạn chưa hoàn thành tất cả trạm"

2. Player chưa ở trạng thái PENDING hoặc COMPLETED
   → Kiểm tra reward_status
   → PENDING → 400 "Bạn đã gửi yêu cầu, vui lòng chờ"
   → COMPLETED → 400 "Bạn đã nhận thưởng"

3. Tạo reward_request → update user.reward_status = PENDING → emit socket

process-reward (staff):
1. Staff phải được phân quyền tại trạm có is_reward = true
2. reward_request.status phải là PENDING
3. Update → COMPLETED, set processed_by, processed_at
4. Update user.reward_status = COMPLETED
5. Emit socket "reward:completed" tới player
```

### Kiểm tra hoàn thành Phase 5

- [ ] Player xem progress → danh sách trạm + điểm + tổng
- [ ] Player chưa đủ trạm → không có nút nhận thưởng (API trả trạng thái)
- [ ] Player đủ trạm → request-reward → tạo reward_request, status PENDING
- [ ] Socket: Trạm Đổi Thưởng nhận notification realtime
- [ ] Staff xử lý → reward_request COMPLETED, player nhận socket notification
- [ ] Player đã nhận thưởng → request lần 2 → 400

---

## Phase 6: Admin — Dashboard & Player Management

**Mục tiêu:** Admin xem thống kê, quản lý điểm người chơi.

### Endpoints

| Method | Path | Auth | Mô tả |
|--------|------|------|-------|
| GET | `/api/v1/admin/dashboard` | Admin | Thống kê tổng quan |
| GET | `/api/v1/admin/players` | Admin | Danh sách người chơi + điểm chi tiết |
| GET | `/api/v1/admin/players/:id` | Admin | Chi tiết 1 người chơi |
| PUT | `/api/v1/admin/scores/:id` | Admin | Sửa điểm (phòng trường hợp nhập sai) |
| DELETE | `/api/v1/admin/scores/:id` | Admin | Xoá điểm |

### Dashboard Response

```json
{
  "totalPlayers": 150,
  "totalStations": 7,
  "stationStats": [
    { "stationId": "...", "stationName": "Trạm 1", "completedCount": 80, "avgScore": 2.1 }
  ],
  "completedAllStations": 45,
  "rewardStats": {
    "pending": 3,
    "completed": 40
  }
}
```

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 6.1 | Admin repository | `src/repositories/admin.repository.ts` | getDashboardStats (aggregate queries), getPlayers (join scores), updateScore, deleteScore |
| 6.2 | Admin service | `src/services/admin.service.ts` | Wrap repository + business logic khi sửa/xoá điểm |
| 6.3 | Admin controller | `src/controllers/admin.controllers.ts` | Wrap service |
| 6.4 | Admin routes | `src/routes/admin.routes.ts` | Tất cả require Admin role |
| 6.5 | Register routes | `root.routes.ts` | Mount `/admin` |

### Kiểm tra hoàn thành Phase 6

- [ ] Dashboard trả đúng số liệu thống kê
- [ ] Danh sách players có điểm chi tiết từng trạm
- [ ] Admin sửa điểm → cập nhật thành công
- [ ] Admin xoá điểm → score record bị xoá

---

## Phase 7: Frontend — Auth + Base Setup

**Mục tiêu:** Setup Axios, Redux store, auth pages, protected routes.

### Pages

| Page | Path | Mô tả |
|------|------|-------|
| Register | `/register` | Form: MSSV + password + confirm password |
| Login | `/login` | Form: MSSV + password |

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 7.1 | Axios instances | `src/utils/axiosInstance.ts` | `publicApi` (no auth), `privateApi` (auto Bearer + refresh on 401) |
| 7.2 | LocalStorage wrapper | `src/utils/localStorage.ts` | get/set/remove cho access_token, refresh_token |
| 7.3 | Constants & enums | `src/constants/enums.ts` | RoleType (ADMIN, STATION_STAFF, PLAYER), RewardStatus (NONE, PENDING, COMPLETED) |
| 7.4 | Types | `src/types/user.ts` | UserType, LoginInput, RegisterInput, LoginResponse |
| 7.5 | Auth API client | `src/api-requests/auth.requests.ts` | AuthApi: login, register, getMe, refreshToken, logout |
| 7.6 | Redux store | `src/store/store.ts` | configureStore, export RootState, AppDispatch |
| 7.7 | User slice | `src/features/userSlice.ts` | state: user, isLoading. Thunks: getInfo, login, logout |
| 7.8 | useRedux hook | `src/hooks/useRedux.ts` | useAppDispatch, useAppSelector |
| 7.9 | useAuth hook | `src/hooks/useAuth.ts` | Return user, isAuthenticated, role |
| 7.10 | ProtectedRoute | `src/layout/ProtectedRoute.tsx` | Check role → render Outlet hoặc redirect |
| 7.11 | Register page | `src/pages/Register/index.tsx` | Form + validation + call AuthApi.register → redirect login |
| 7.12 | Login page | `src/pages/Login/index.tsx` | Form + call AuthApi.login → store tokens → redirect theo role |
| 7.13 | Router setup | `src/router/index.tsx` | Public: /, /login, /register. Protected: /player/*, /staff/*, /admin/* |
| 7.14 | React Query provider | `src/main.tsx` | Wrap App với QueryClientProvider + Redux Provider |

### Kiểm tra hoàn thành Phase 7

- [ ] Register → tạo tài khoản → redirect login
- [ ] Login → lưu token → redirect theo role (ADMIN → /admin, STAFF → /staff, PLAYER → /player)
- [ ] Truy cập /admin khi role PLAYER → redirect hoặc 403
- [ ] Token hết hạn → auto refresh
- [ ] Logout → xoá token → redirect login

---

## Phase 8: Frontend — Player UI

**Mục tiêu:** Giao diện người chơi: tiến trình trạm, nhận thưởng.

### Pages

| Page | Path | Mô tả |
|------|------|-------|
| Player Dashboard | `/player` | Tiến trình 7 trạm + tổng điểm + nút nhận thưởng |

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 8.1 | Types | `src/types/player.ts` | ProgressResponse, StationProgress, RewardRequest |
| 8.2 | Player API client | `src/api-requests/player.requests.ts` | PlayerApi: getProgress, requestReward |
| 8.3 | Player layout | `src/layout/PlayerLayout.tsx` | Header (MSSV, logout) + Outlet |
| 8.4 | Station progress card | `src/components/StationCard.tsx` | Card hiển thị: tên trạm, trạng thái (chưa chơi/đã chơi), điểm |
| 8.5 | Player dashboard | `src/pages/Player/index.tsx` | Grid 7 StationCards + tổng điểm + nút "Nhận thưởng" (disabled nếu chưa đủ) + trạng thái reward |
| 8.6 | Socket client | `src/utils/socket.ts` | Connect socket.io-client với Bearer token |
| 8.7 | Socket hook | `src/hooks/useSocket.ts` | Connect/disconnect, listen events |
| 8.8 | Reward notification | Player dashboard | Listen `reward:completed` → toast + cập nhật UI |

### UI States

```
Chưa đủ trạm:
  ┌──────────────────────────────┐
  │ Tiến trình: 4/7 trạm        │
  │ Tổng điểm: 9                │
  │                              │
  │ [Trạm 1 ✓ 3đ] [Trạm 2 ✓ 2đ]│
  │ [Trạm 3 ✓ 2đ] [Trạm 4 ✓ 2đ]│
  │ [Trạm 5 ○    ] [Trạm 6 ○   ]│
  │ [Trạm 7 ○    ]              │
  │                              │
  │ [Nhận thưởng] (disabled)     │
  └──────────────────────────────┘

Đủ trạm:
  │ [Nhận thưởng] (active, primary color)

Đã gửi yêu cầu:
  │ ⏳ Đang chờ trao thưởng...

Đã nhận thưởng:
  │ 🎉 Đã nhận thưởng!
```

### Kiểm tra hoàn thành Phase 8

- [ ] Player thấy tiến trình đúng (trạm đã chơi/chưa chơi)
- [ ] Tổng điểm hiển thị đúng
- [ ] Chưa đủ trạm → nút disabled
- [ ] Đủ trạm → nhấn "Nhận thưởng" → trạng thái chuyển PENDING
- [ ] Nhận socket notification khi staff trao thưởng → UI cập nhật

---

## Phase 9: Frontend — Staff UI

**Mục tiêu:** Giao diện nhân sự: chấm điểm + màn hình đổi thưởng.

### Pages

| Page | Path | Mô tả |
|------|------|-------|
| Score Entry | `/staff` | Form nhập MSSV + chọn điểm tại trạm được phân quyền |
| Reward Station | `/staff/rewards` | Danh sách yêu cầu đổi thưởng (realtime) |

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 9.1 | Types | `src/types/score.ts` | ScoreInput, StationScoreList |
| 9.2 | Types | `src/types/reward.ts` | RewardRequestType |
| 9.3 | Score API client | `src/api-requests/score.requests.ts` | ScoreApi: createScore, getStationScores |
| 9.4 | Reward API client | `src/api-requests/reward.requests.ts` | RewardApi: getPendingRewards, completeReward |
| 9.5 | Staff layout | `src/layout/StaffLayout.tsx` | Header (tên trạm, logout) + nav nếu có reward role + Outlet |
| 9.6 | Score entry page | `src/pages/Staff/index.tsx` | Select trạm (từ assigned stations) → nhập MSSV → chọn điểm 1/2/3 → submit. Toast thành công/lỗi |
| 9.7 | Score history | `src/pages/Staff/index.tsx` | Bảng danh sách người đã chấm tại trạm hiện tại |
| 9.8 | Reward station page | `src/pages/Staff/Rewards/index.tsx` | Danh sách PENDING requests (MSSV, tổng điểm, thời gian). Nút "Đã trao thưởng" |
| 9.9 | Realtime rewards | Reward page | Listen socket `reward:request` → thêm vào danh sách + sound/toast notification |

### Kiểm tra hoàn thành Phase 9

- [ ] Staff chọn trạm → nhập MSSV → cộng điểm → toast thành công
- [ ] MSSV sai/trùng → toast lỗi tương ứng
- [ ] Staff chỉ thấy trạm mình được phân quyền
- [ ] Reward station: danh sách pending hiển thị realtime
- [ ] Nhấn "Đã trao thưởng" → request biến mất, player nhận notification

---

## Phase 10: Frontend — Admin UI

**Mục tiêu:** Giao diện Admin: CRUD trạm/nhân sự, dashboard thống kê, quản lý điểm.

### Pages

| Page | Path | Mô tả |
|------|------|-------|
| Dashboard | `/admin` | Thống kê tổng quan |
| Stations | `/admin/stations` | CRUD trạm |
| Staff | `/admin/staff` | CRUD nhân sự + phân quyền trạm |
| Players | `/admin/players` | Danh sách người chơi + điểm chi tiết |
| Player Detail | `/admin/players/:id` | Chi tiết 1 người chơi + sửa/xoá điểm |

### Tasks

| # | Task | File | Chi tiết |
|---|------|------|----------|
| 10.1 | Types | `src/types/station.ts`, `src/types/staff.ts`, `src/types/admin.ts` | StationType, StaffType, DashboardStats |
| 10.2 | Station API client | `src/api-requests/station.requests.ts` | StationApi: getAll, create, update, delete |
| 10.3 | Staff API client | `src/api-requests/staff.requests.ts` | StaffApi: getAll, create, update, delete |
| 10.4 | Admin API client | `src/api-requests/admin.requests.ts` | AdminApi: getDashboard, getPlayers, getPlayerDetail, updateScore, deleteScore |
| 10.5 | Admin layout | `src/layout/AdminLayout.tsx` | Sidebar nav (Dashboard, Stations, Staff, Players) + Header + Outlet |
| 10.6 | Dashboard page | `src/pages/Admin/index.tsx` | Cards: tổng người chơi, hoàn thành tất cả trạm, đã đổi thưởng. Bảng stats theo trạm |
| 10.7 | Stations page | `src/pages/Admin/Stations/index.tsx` | Bảng danh sách + dialog tạo/sửa + xoá (confirm) |
| 10.8 | Staff page | `src/pages/Admin/Staff/index.tsx` | Bảng danh sách + dialog tạo/sửa (multi-select trạm) + xoá |
| 10.9 | Players page | `src/pages/Admin/Players/index.tsx` | Bảng: MSSV, tổng điểm, số trạm hoàn thành, trạng thái thưởng. Search by MSSV |
| 10.10 | Player detail page | `src/pages/Admin/Players/Detail/index.tsx` | Bảng điểm từng trạm + nút sửa/xoá điểm |

### Kiểm tra hoàn thành Phase 10

- [ ] Dashboard hiển thị đúng số liệu
- [ ] CRUD stations hoạt động (tạo/sửa/xoá)
- [ ] CRUD staff hoạt động + phân quyền multi-select trạm
- [ ] Danh sách players + search MSSV
- [ ] Admin sửa/xoá điểm → cập nhật đúng

---

## Checklist tổng kết

| Phase | Status |
|-------|--------|
| Phase 0: Backend Setup | ⬜ |
| Phase 1: Database Schema | ⬜ |
| Phase 2: Auth Module | ⬜ |
| Phase 3: Admin Station & Staff CRUD | ⬜ |
| Phase 4: Staff Scoring API | ⬜ |
| Phase 5: Player Progress & Reward | ⬜ |
| Phase 6: Admin Dashboard | ⬜ |
| Phase 7: Frontend Auth + Base | ⬜ |
| Phase 8: Frontend Player UI | ⬜ |
| Phase 9: Frontend Staff UI | ⬜ |
| Phase 10: Frontend Admin UI | ⬜ |
