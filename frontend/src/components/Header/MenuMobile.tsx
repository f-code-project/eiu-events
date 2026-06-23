import { Gamepad2, House, LayoutDashboard, Trophy, Users } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { RoleType } from '~/constants/enums';
import useAuth from '~/hooks/useAuth';
import { Button } from '../ui/button';
import { MobileNavLink } from './NavLink';

const MenuMobileHeader = ({
  setShowMobileMenu,
}: {
  setShowMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="mt-4 border-t border-gray-100 pt-4 lg:hidden">
      <nav className="space-y-1">
        <MobileNavLink
          url="/"
          name="Trang chủ"
          Icon={House}
          active={location.pathname === '/'}
          onClick={() => setShowMobileMenu(false)}
        />

        {isAuthenticated && user && (
          <>
            {user.role === RoleType.PLAYER && (
              <MobileNavLink
                url="/player"
                name="Dashboard"
                Icon={Gamepad2}
                active={location.pathname.startsWith('/player')}
                onClick={() => setShowMobileMenu(false)}
              />
            )}
            {user.role === RoleType.STATION_STAFF && (
              <>
                <MobileNavLink
                  url="/staff"
                  name="Nhập điểm"
                  Icon={LayoutDashboard}
                  active={location.pathname === '/staff'}
                  onClick={() => setShowMobileMenu(false)}
                />
                <MobileNavLink
                  url="/staff/rewards"
                  name="Phát thưởng"
                  Icon={Trophy}
                  active={location.pathname === '/staff/rewards'}
                  onClick={() => setShowMobileMenu(false)}
                />
              </>
            )}
            {user.role === RoleType.ADMIN && (
              <>
                <MobileNavLink
                  url="/admin"
                  name="Dashboard"
                  Icon={LayoutDashboard}
                  active={location.pathname === '/admin'}
                  onClick={() => setShowMobileMenu(false)}
                />
                <MobileNavLink
                  url="/admin/stations"
                  name="Trạm chơi"
                  Icon={Gamepad2}
                  active={location.pathname === '/admin/stations'}
                  onClick={() => setShowMobileMenu(false)}
                />
                <MobileNavLink
                  url="/admin/staff"
                  name="Nhân viên"
                  Icon={Users}
                  active={location.pathname === '/admin/staff'}
                  onClick={() => setShowMobileMenu(false)}
                />
              </>
            )}
          </>
        )}
      </nav>

      {isAuthenticated && user ? (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <div className="from-primary/20 to-primary/40 text-primary flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br text-sm font-semibold">
              {user.mssv.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{user.mssv}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <button
              onClick={() => {
                setShowMobileMenu(false);
                logout();
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <Link to="/login" onClick={() => setShowMobileMenu(false)}>
            <Button className="w-full">Đăng nhập</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MenuMobileHeader;
