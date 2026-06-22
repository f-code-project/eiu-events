# Coding Standards

## Naming

### Files
```
backend/src/controllers/user.controllers.ts    # entity.controllers.ts
backend/src/services/user.service.ts           # entity.service.ts
backend/src/repositories/user.repository.ts    # entity.repository.ts
backend/src/routes/auth.routes.ts              # entity.routes.ts
backend/src/schemas/auth.schema.ts             # entity.schema.ts
backend/src/middlewares/auth.middlewares.ts     # concern.middlewares.ts

frontend/src/pages/Login/index.tsx             # PascalCase folder + index.tsx
frontend/src/components/Header/NavLink.tsx      # PascalCase.tsx
frontend/src/hooks/useAuth.ts                  # camelCase with "use" prefix
frontend/src/api-requests/auth.requests.ts     # entity.requests.ts
frontend/src/features/userSlice.ts             # entitySlice.ts
frontend/src/components/ui/alert-dialog.tsx    # kebab-case (shadcn/ui only)
```

### Code
- Functions & variables: `camelCase`
- React components: `PascalCase`
- Types & interfaces: `PascalCase` with descriptive suffix — `UserType`, `LoginInput`, `LoginResponse`
- Enums: `PascalCase` name, `UPPER_CASE` values — `RoleType.CANDIDATE`
- Constants: `UPPER_CASE` — `HTTP_STATUS`, `USER_ROLE`
- Classes: `PascalCase` — `AuthService`, `UserRepository`

## Import Order

Separate groups with blank line:

```typescript
// 1. External packages
import { Request, Response } from 'express';
import { useQuery } from '@tanstack/react-query';

// 2. Internal configs
import redisClient from '~/configs/redis';

// 3. Constants & enums
import { RoleType } from '~/constants/enums';
import { HTTP_STATUS } from '~/constants/httpStatus';

// 4. Business logic (repositories, services, API clients)
import userRepository from '~/repositories/user.repository';
import AuthApi from '~/api-requests/auth.requests';

// 5. Components, hooks, layouts
import Badge from '~/components/Badge';
import useAuth from '~/hooks/useAuth';

// 6. Utils, helpers
import { cn } from '~/lib/utils';

// 7. Types (always last, use `import type`)
import type { UserType } from '~/types/user';
```

Use `prettier-plugin-organize-imports` to auto-sort.

## Formatting (Prettier)

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "always",
  "bracketSameLine": false,
  "bracketSpacing": true
}
```

## TypeScript

- Always use strict mode
- Path alias `~/*` maps to `src/*` in both frontend and backend
- Prefer `type` over `interface` for data shapes
- Use `import type` for type-only imports
- No `any` — use `unknown` if type is uncertain, then narrow
- Export types from `src/types/` (frontend) or inline near usage (backend)

## React Patterns

- Functional components only — no class components
- Arrow function for components: `const Header = () => { ... }`
- Default export for pages: `export default App`
- Named exports for utility functions and types
- Custom hooks start with `use` prefix
- Colocate component-specific files in same folder (e.g., `Header/index.tsx`, `Header/Admin.tsx`)

## Error Messages

- User-facing messages in Vietnamese
- Log messages and code comments in English or Vietnamese (be consistent per file)
- Toast notifications via Sonner: `toast.success('Thành công!')`, `toast.error('Có lỗi xảy ra!')`
