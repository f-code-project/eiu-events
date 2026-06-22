# Architecture Rules

## Backend: 3-Layer Architecture

```
Route → Middleware → Controller → Service → Repository → Drizzle
```

### Layer Responsibilities

**Routes** (`src/routes/*.routes.ts`)
- Define HTTP method + path
- Chain validation middleware + auth middleware
- Call controller method
- One router per domain entity, registered in `root.routes.ts`

```typescript
const teamRouter = Router();
teamRouter.get('/', teamController.getAll);
teamRouter.post('/', middlewareAuth.auth, isRole([RoleType.ADMIN]), validate(createTeamSchema), teamController.create);
export default teamRouter;
```

**Controllers** (`src/controllers/*.controllers.ts`)
- Extract params from `req` (body, params, query)
- Call service method
- Return response via `ResponseClient`
- No business logic here

```typescript
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await teamService.getAll();
    res.status(HTTP_STATUS.OK).json(new ResponseClient({ message: 'Thành công', result }));
  } catch (err) {
    next(err);
  }
};
```

**Services** (`src/services/*.service.ts`)
- Business logic lives here
- Call repository for data access
- Throw `ErrorWithStatus` for errors
- May call other services, Redis, queues

**Repositories** (`src/repositories/*.repository.ts`)
- Drizzle queries only
- No business logic
- Return raw query results
- One repository per DB table

### Error Handling

- Throw `ErrorWithStatus({ message, status })` anywhere in the chain
- `defaultErrorHandler` middleware catches all, formats as `ResponseClient`
- Never send raw error objects to client

### Response Format

All API responses use `ResponseClient` wrapper:

```typescript
// Success
new ResponseClient({ message: 'Thành công', result: data })

// Error (via middleware)
new ResponseClient({ status: false, message: 'Lỗi', errors: [...] })
```

## Frontend: Pages + State Architecture

### Folder Roles

| Folder | Role | Rule |
|--------|------|------|
| `pages/` | Route-level components | One folder per page, `index.tsx` as entry. Subfolder for sub-pages |
| `components/` | Shared reusable UI | Never import from `pages/`. Components here are page-agnostic |
| `components/ui/` | shadcn/ui primitives | Never edit directly — regenerate via `npx shadcn@latest add` |
| `features/` | Redux slices | One file per slice: `entitySlice.ts` |
| `hooks/` | Custom React hooks | Shared hooks only. Page-specific hooks stay in page folder |
| `api-requests/` | API client classes | One class per backend domain. Static methods. Use `privateApi` or `publicApi` |
| `store/` | Redux store config | `configureStore` setup, type exports (`RootState`, `AppDispatch`) |
| `layout/` | Layout wrappers | `MainLayout`, `ProtectedRoute`, role-specific layouts |
| `types/` | TypeScript types | Shared type definitions. One file per domain |
| `utils/` | Helpers | `axiosInstance`, `localStorage` wrapper, `notification` helper |
| `lib/` | Library utils | `cn()` function for Tailwind class merging |
| `constants/` | App constants | Enums, config values, magic strings |
| `styles/` | Global CSS | Tailwind base + custom global styles |

### State Management Split

- **Redux Toolkit** for auth/user state (persists across pages)
- **React Query** for server data (teams, candidates, scores — cached + auto-refetch)
- **Local state** (`useState`) for UI-only state (modals, dropdowns, form inputs)

Never put server data in Redux. Use React Query for anything from the API.

### Routing

- `BrowserRouter` → `Routes` → `Route` (React Router 7)
- Role-protected routes wrap with `<ProtectedRoute roleAccess={[USER_ROLE.ADMIN]}>`
- Nested routes for sub-pages: `/admin/users`, `/judge/room/:roomId`
- Public routes: `/`, `/login`, `/teams`, `/active/token/:token`

### Axios Setup

Two instances in `src/utils/axiosInstance.ts`:
- `publicApi` — no auth header, for login/register/public endpoints
- `privateApi` — auto-injects Bearer token, auto-refreshes on 401

All API classes import from `~/utils/axiosInstance`.
