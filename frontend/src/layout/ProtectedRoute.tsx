import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import Loading from '~/components/Loading';
import NoAccess from '~/components/NoAccess';
import useAuth from '~/hooks/useAuth';

import type { RoleType } from '~/constants/enums';

type Props = {
  roleAccess: RoleType[];
};

const ProtectedRoute = ({ roleAccess }: Props) => {
  const { isLoading, isAuthenticated, role, fetchUser } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      fetchUser();
    }
  }, [isAuthenticated, isLoading, fetchUser]);

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && !roleAccess.includes(role)) return <NoAccess />;

  return <Outlet />;
};

export default ProtectedRoute;
