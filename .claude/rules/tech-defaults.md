# Tech Defaults

When adding new functionality, use these libraries by default. Do not introduce alternatives without discussion.

## Frontend

| Concern | Library | Notes |
|---------|---------|-------|
| Framework | React 19 | Functional components only, no class components |
| Routing | React Router 7 | `BrowserRouter` + `Routes` + `Route` |
| Build | Vite 7+ | With `@vitejs/plugin-react` + `@tailwindcss/vite` |
| Styling | Tailwind CSS 4 | Utility-first, no CSS modules, no styled-components |
| UI primitives | shadcn/ui (Radix) | New-york style, lucide icons. Install via `npx shadcn@latest add <component>` |
| Class utils | `clsx` + `tailwind-merge` + `class-variance-authority` | Use `cn()` helper from `~/lib/utils` |
| Global state | Redux Toolkit | `createSlice` + `createAsyncThunk`. Store in `src/store/` |
| Server state | TanStack React Query | `useQuery` + `useMutation` for API data |
| HTTP client | Axios | Two instances: `publicApi` (no auth) + `privateApi` (auto Bearer token) |
| Real-time | Socket.io-client | Connect via `VITE_API_BACKEND` env var |
| Notifications | Sonner | `toast.success()`, `toast.error()` |
| Icons | lucide-react | Consistent with shadcn/ui |
| Animations | animate.css + tw-animate-css | CSS class-based animations |
| Onboarding | driver.js | Step-by-step user tours |
| TypeScript | Strict mode | Path alias `~/*` → `src/*` |

## Backend

| Concern | Library | Notes |
|---------|---------|-------|
| Framework | Express 5 | ESM modules, `type: "module"` |
| ORM | Drizzle ORM | MySQL provider via mysql2, schema in `src/db/schema.ts`, config in `drizzle.config.ts` |
| Database | MySQL 8 | Via Docker, port 3306 |
| Cache | Redis 7 | Via Docker, port 6379. Use `ioredis` client |
| Job queue | BullMQ | Redis-backed, workers in `src/workers/` |
| Validation | Zod 4 | Schemas in `src/schemas/`. Validate in route middleware |
| Auth | jsonwebtoken + bcrypt | Access + refresh token pattern |
| Email | Nodemailer + Handlebars | Templates for activation, notifications |
| Rate limit | express-rate-limit | Apply to auth routes at minimum |
| TypeScript | Strict mode | Path alias `~/*` → `src/*`, build with `tsc && tsc-alias` |
| Dev server | Nodemon + tsx | Auto-reload, watches `src/` and `.env` |

## Versions & Constraints

- Node.js: LTS (20+)
- Package manager: npm (not yarn, not pnpm)
- Module system: ESM (`"type": "module"` in both package.json)
- TypeScript: strict mode in both frontend and backend
