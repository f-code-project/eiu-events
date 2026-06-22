# Workflow Rules

## Development Flow

1. Start infrastructure first: `docker compose up -d` (MySQL + Redis + phpMyAdmin)
2. Backend runs on port 8000, frontend on port 5173
3. After schema changes: `npx drizzle-kit generate` + `npx drizzle-kit migrate`
4. Use `npm run dev` in both backend/ and frontend/ for development

## Task Workflow (mandatory)

Every task/feature MUST follow this loop:

```
1. Branch → 2. Code → 3. Commit → 4. Review → 5. Push → 6. STOP
     ↑                                                        │
     └──────────── Wait for user command ─────────────────────┘
```

### Steps

1. **Create branch** from current branch: `feature/<name>`, `fix/<name>`, `hotfix/<name>`
2. **Code** — follow code quality rules below
3. **Commit** — Conventional Commits format, use `writing-commit-messages` skill:
   - Format: `<type>(<scope>): <summary>`
   - Subject ≤50 chars, imperative mood ("add", "fix", "remove")
   - Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `perf`, `build`
   - Body only when explaining WHY (breaking changes, security fixes, migrations)
   - Each commit = 1 logical change, never bundle unrelated changes
4. **Self-review** — review all written code, provide feedback, improve before pushing
5. **Git push** — push branch to remote
6. **STOP** — report completion, wait for user command. **NEVER auto-proceed to next task**

### Code Quality Rules

- **Small functions** — each function does exactly one thing
- **Short functions** — >20 lines → consider splitting
- **Clear naming** — function name tells what it does
- **No duplication** — extract shared logic
- **Keep it simple** — no over-engineering

## Git Conventions

- Branch naming: `feature/<name>`, `fix/<name>`, `hotfix/<name>`
- Never commit `.env` files — use `.env.example` as template
- Run `npm run lint` before committing frontend changes

## API Versioning

- All backend routes mount under `/api/v1`
- Root router in `backend/src/routes/root.routes.ts` aggregates all feature routers
- New features get their own router file: `<feature>.routes.ts`

## Adding a New Feature (Full Stack)

### Backend
1. Create Drizzle table schema in `src/db/schema.ts`
2. Run `npx drizzle-kit generate` + `npx drizzle-kit migrate`
3. Create repository: `src/repositories/<feature>.repository.ts`
4. Create service: `src/services/<feature>.service.ts`
5. Create controller: `src/controllers/<feature>.controllers.ts`
6. Create Zod schema: `src/schemas/<feature>.schema.ts`
7. Create route: `src/routes/<feature>.routes.ts`
8. Register route in `src/routes/root.routes.ts`

### Frontend
1. Create types: `src/types/<feature>.ts`
2. Create API client: `src/api-requests/<feature>.requests.ts`
3. Create page: `src/pages/<Feature>/index.tsx`
4. Add route in `src/App.tsx` (wrap with `ProtectedRoute` if role-restricted)
5. If global state needed: create Redux slice in `src/features/<feature>Slice.ts`
6. If reusable UI needed: add component in `src/components/<Feature>/`

## Environment Files

- Backend: copy `.env.example` → `.env`, fill secrets
- Frontend: `.env.development` for local, `.env.production` for deploy
- Frontend env vars must start with `VITE_` prefix
- Never hardcode URLs — always use env vars
