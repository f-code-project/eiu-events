import { createBrowserRouter } from 'react-router-dom';

import { RoleType } from '~/constants/enums';
import MasterLayout from '~/layout/MasterLayout';
import PlayerLayout from '~/layout/PlayerLayout';
import ProtectedRoute from '~/layout/ProtectedRoute';
import StaffLayout from '~/layout/StaffLayout';
import AdminDashboard from '~/pages/Admin';
import AdminPlayers from '~/pages/Admin/Players';
import PlayerDetailPage from '~/pages/Admin/Players/Detail';
import AdminStaff from '~/pages/Admin/Staff';
import AdminStations from '~/pages/Admin/Stations';
import HomePage from '~/pages/Home';
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
      { index: true, element: <HomePage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },

      {
        path: 'admin',
        element: <ProtectedRoute roleAccess={[RoleType.ADMIN]} />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'stations', element: <AdminStations /> },
          { path: 'staff', element: <AdminStaff /> },
          { path: 'players', element: <AdminPlayers /> },
          { path: 'players/:id', element: <PlayerDetailPage /> },
        ],
      },
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
  { path: '*', element: <NotFound /> },
]);
