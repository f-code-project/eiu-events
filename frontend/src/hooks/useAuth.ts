import { useCallback } from 'react';

import AuthApi from '~/api-requests/auth.requests';
import { clearUser, getInfo, setUser } from '~/features/userSlice';
import { useAppDispatch, useAppSelector } from '~/hooks/useRedux';
import LocalStorage from '~/utils/localStorage';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated } = useAppSelector((state) => state.user);

  const fetchUser = useCallback(() => {
    dispatch(getInfo());
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await AuthApi.logout();
    } finally {
      LocalStorage.removeItem('login');
      dispatch(clearUser());
    }
  }, [dispatch]);

  return {
    user,
    isLoading,
    isAuthenticated,
    role: user?.role ?? null,
    fetchUser,
    logout,
    setUser: (u: any) => dispatch(setUser(u)),
  };
};

export default useAuth;
