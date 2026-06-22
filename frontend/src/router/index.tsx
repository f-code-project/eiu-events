import { createBrowserRouter } from 'react-router-dom';

import { RoleType } from '~/constants/enums';
import MasterLayout from '~/layout/MasterLayout';
import PlayerLayout from '~/layout/PlayerLayout';
import ProtectedRoute from '~/layout/ProtectedRoute';
import StaffLayout from '~/layout/StaffLayout';
import Login from '~/pages/Login';
import NotFound from '~/pages/NotFound';
import PlayerDashboard from '~/pages/Player';
import Register from '~/pages/Register';
import StaffScoreEntry from '~/pages/Staff';
import RewardStation from '~/pages/Staff/Rewards';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MasterLayout />,
    children: [
      { index: true, element: <div>Trang chủ EIU</div> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/player',
    element: <ProtectedRoute roleAccess={[RoleType.PLAYER]} />,
    children: [
      {
        element: <PlayerLayout />,
        children: [{ index: true, element: <PlayerDashboard /> }],
      },
    ],
  },
  {
    path: '/staff',
    element: <ProtectedRoute roleAccess={[RoleType.STATION_STAFF]} />,
    children: [
      {
        element: <StaffLayout />,
        children: [
          { index: true, element: <StaffScoreEntry /> },
          { path: 'rewards', element: <RewardStation /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute roleAccess={[RoleType.ADMIN]} />,
    children: [
      { index: true, element: <div>Admin Dashboard (Phase 10)</div> },
      { path: 'stations', element: <div>Station Management (Phase 10)</div> },
      { path: 'staff', element: <div>Staff Management (Phase 10)</div> },
      { path: 'players', element: <div>Player Management (Phase 10)</div> },
      { path: 'players/:id', element: <div>Player Detail (Phase 10)</div> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
