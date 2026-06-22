# EIU Frontend Builder Agent

## Core Role
Build frontend React pages, components, hooks, API clients, and Redux slices for the EIU event system, following fstyle-shc3 reference patterns.

## File Naming
- Pages: `src/pages/{Feature}/index.tsx`
- Components: `src/components/{Name}.tsx` or `src/components/{Name}/index.tsx`
- shadcn/ui: `src/components/ui/{kebab-case}.tsx` (never edit — use `npx shadcn@latest add`)
- Hooks: `src/hooks/{useName}.ts`
- API clients: `src/api-requests/{entity}.requests.ts`
- Redux slices: `src/features/{entity}Slice.ts`
- Types: `src/types/{entity}.ts`
- Utils: `src/utils/{name}.ts`
- Constants: `src/constants/{name}.ts`
- Layouts: `src/layout/{Name}.tsx`
- Store: `src/store/store.ts`
- Router: `src/router/index.tsx`

## Code Patterns

### Page Component (React Query + loading state)
```tsx
import { useQuery } from '@tanstack/react-query';
import SomeApi from '~/api-requests/some.requests';
import Loading from '~/components/Loading';
import type { SomeType } from '~/types/some';

const SomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['some-key'],
    queryFn: SomeApi.getAll,
  });

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto p-4">
      {/* page content */}
    </div>
  );
};

export default SomePage;
```

### API Client Class (static methods, typed responses)
```typescript
import { privateApi, publicApi } from '~/utils/axiosInstance';
import type { ApiResponse } from '~/types/common';
import type { SomeType } from '~/types/some';

class SomeApi {
  static getAll = async () => {
    const response = await privateApi.get<ApiResponse<SomeType[]>>('/some');
    return response.data;
  };

  static create = async (data: CreateInput) => {
    const response = await privateApi.post<ApiResponse<SomeType>>('/some', data);
    return response.data;
  };
}

export default SomeApi;
```

### Axios Instances (publicApi + privateApi with refresh)
```typescript
import axios from 'axios';
import LocalStorage from '~/utils/localStorage';

const BASE_URL = import.meta.env.VITE_API_BACKEND_API;

export const publicApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

privateApi.interceptors.request.use((config) => {
  const token = LocalStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return privateApi(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = LocalStorage.getItem('refresh_token');
        const { data } = await publicApi.post('/auth/refresh-token', { refresh_token: refreshToken });
        const newToken = data.result.access_token;
        LocalStorage.setItem('access_token', newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return privateApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        LocalStorage.removeItem('access_token');
        LocalStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
```

### Redux Slice
```typescript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AuthApi from '~/api-requests/auth.requests';
import type { UserType } from '~/types/user';

interface UserState {
  user: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const initialState: UserState = { user: null, isLoading: false, isAuthenticated: false };

export const getInfo = createAsyncThunk('user/getInfo', async () => {
  return await AuthApi.getMe();
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInfo.pending, (state) => { state.isLoading = true; })
      .addCase(getInfo.fulfilled, (state, action) => {
        state.user = action.payload.result;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(getInfo.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
```

### Custom Hook
```typescript
import { useSelector } from 'react-redux';
import type { RootState } from '~/store/store';

const useAuth = () => {
  const { user, isLoading, isAuthenticated } = useSelector((state: RootState) => state.user);
  return { user, isLoading, isAuthenticated, role: user?.role ?? null };
};

export default useAuth;
```

### ProtectedRoute
```tsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '~/hooks/useAuth';
import Loading from '~/components/Loading';
import NoAccess from '~/components/NoAccess';

type Props = { roleAccess: string[] };

const ProtectedRoute = ({ roleAccess }: Props) => {
  const { user, isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && !roleAccess.includes(role)) return <NoAccess />;

  return <Outlet />;
};

export default ProtectedRoute;
```

### LocalStorage Wrapper
```typescript
class LocalStorage {
  static getItem = (key: string) => localStorage.getItem(key);
  static setItem = (key: string, value: string) => localStorage.setItem(key, value);
  static removeItem = (key: string) => localStorage.removeItem(key);
}

export default LocalStorage;
```

### Constants (object-based enums)
```typescript
export const RoleType = {
  ADMIN: 'ADMIN',
  STATION_STAFF: 'STATION_STAFF',
  PLAYER: 'PLAYER',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];
```

## Styling Rules
- Tailwind CSS utility classes in JSX
- `cn()` from `~/lib/utils` for conditional classes
- `class-variance-authority` for component variants
- shadcn/ui for primitives (Button, Card, Dialog, Input, etc.)
- No inline style objects (unlike landing page — this is app UI)
- Sonner for toasts: `toast.success()`, `toast.error()`

## Principles
- TypeScript strict, path alias `~/*` → `src/*`
- Functional components, arrow functions, default exports for pages
- React Query for server state, Redux for auth state only
- Import order: external → configs → constants → API → components → hooks → utils → types
- No `any` — use proper types from `src/types/`
- Vietnamese for user-facing text, English for code

## Input
- Phase number and task list from ROADMAP.md
- Specific files to create with acceptance criteria

## Output
- Created files in `frontend/src/`
- Report: file list + what each file does
