# Frontend Patterns

## Component Structure

Page component template:

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

## API Client Class

```typescript
import { privateApi } from '~/utils/axiosInstance';
import type { SomeResponse } from '~/types/some';

class SomeApi {
  static getAll = async () => {
    const response = await privateApi.get<SomeResponse>('/some');
    return response?.data;
  };

  static getById = async (id: string) => {
    const response = await privateApi.get<SomeResponse>(`/some/${id}`);
    return response?.data;
  };

  static create = async (data: CreateInput) => {
    const response = await privateApi.post<SomeResponse>('/some', data);
    return response?.data;
  };
}

export default SomeApi;
```

## Redux Slice

```typescript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SomeApi from '~/api-requests/some.requests';

interface SomeState {
  data: SomeType | null;
  isLoading: boolean;
}

const initialState: SomeState = { data: null, isLoading: false };

export const fetchSome = createAsyncThunk('some/fetch', async () => {
  return await SomeApi.getAll();
});

export const someSlice = createSlice({
  name: 'some',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSome.pending, (state) => { state.isLoading = true; })
      .addCase(fetchSome.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSome.rejected, (state) => { state.isLoading = false; });
  },
});

export const { reset } = someSlice.actions;
export default someSlice.reducer;
```

## Custom Hook

```typescript
import { useSelector } from 'react-redux';
import type { RootState } from '~/store/store';
import { useAppDispatch } from './useRedux';

const useSome = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useSelector((state: RootState) => state.some);

  const refresh = () => dispatch(fetchSome());

  return { data, isLoading, refresh };
};

export default useSome;
```

## Styling Rules

- Use Tailwind utility classes directly in JSX — no separate CSS files per component
- Use `cn()` from `~/lib/utils` for conditional classes:
  ```tsx
  <div className={cn('p-4 rounded', isActive && 'bg-primary text-white')} />
  ```
- Use `class-variance-authority` for component variants:
  ```tsx
  const buttonVariants = cva('px-4 py-2 rounded', {
    variants: {
      variant: { primary: 'bg-primary text-white', outline: 'border border-gray-300' },
      size: { sm: 'text-sm', lg: 'text-lg px-6 py-3' },
    },
    defaultVariants: { variant: 'primary', size: 'sm' },
  });
  ```
- Global styles in `src/styles/global.css` only
- shadcn/ui components use CSS variables for theming

## Protected Routes

```tsx
<Route path="admin" element={<ProtectedRoute roleAccess={[USER_ROLE.ADMIN]} />}>
  <Route index element={<AdminPage />} />
  <Route path="users" element={<AdminUsersPage />} />
</Route>
```

`ProtectedRoute` checks `useAuth()` for role match. Redirects to `/login` if not authenticated, shows forbidden if wrong role.

## LocalStorage Wrapper

Use `LocalStorage` utility (not raw `localStorage`):
```typescript
LocalStorage.setItem('access_token', token);
LocalStorage.getItem('role');
LocalStorage.removeItem('login');
```

Keys used: `access_token`, `refresh_token`, `role`, `login`.
