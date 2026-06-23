import { ChevronDown, Gamepad2, House, LayoutDashboard, Menu, Trophy, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { RoleType } from '~/constants/enums';
import useAuth from '~/hooks/useAuth';
import { Button } from '../ui/button';
import MenuMobileHeader from './MenuMobile';
import { NavLink } from './NavLink';
import SubmenuHeader from './Submenu';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-3 z-50 mt-6 rounded-lg border border-gray-200/60 bg-white/95 px-5 py-3.5 backdrop-blur-xl transition-all md:px-7">
      <div className="mx-auto flex max-w-7xl items-center">
        <Link to="/" className="group flex items-center gap-2.5 transition-all sm:gap-3">
          <div className="relative">
            <img
              src="/fcode.png"
              alt="F-Code"
              className="h-8 w-8 transition-transform group-hover:scale-105 sm:h-9 sm:w-9"
            />
            <div className="bg-primary/20 absolute inset-0 rounded-full opacity-0 blur-md transition-opacity group-hover:opacity-100"></div>
          </div>
          <span className="text-primary text-xl font-bold tracking-tight sm:text-2xl">F-Code</span>
        </Link>

        <nav className="ml-12 hidden lg:block">
          <ul className="flex items-center gap-2">
            <li>
              <NavLink url="/" name="Trang chủ" Icon={House} active={isActive('/')} />
            </li>

            {isAuthenticated && user && (
              <>
                {user.role === RoleType.PLAYER && (
                  <li>
                    <NavLink
                      url="/player"
                      name="Dashboard"
                      Icon={Gamepad2}
                      active={location.pathname.startsWith('/player')}
                    />
                  </li>
                )}
                {user.role === RoleType.STATION_STAFF && (
                  <>
                    <li>
                      <NavLink url="/staff" name="Nhập điểm" Icon={LayoutDashboard} active={isActive('/staff')} />
                    </li>
                    <li>
                      <NavLink
                        url="/staff/rewards"
                        name="Phát thưởng"
                        Icon={Trophy}
                        active={isActive('/staff/rewards')}
                      />
                    </li>
                  </>
                )}
                {user.role === RoleType.ADMIN && (
                  <>
                    <li>
                      <NavLink url="/admin" name="Dashboard" Icon={LayoutDashboard} active={isActive('/admin')} />
                    </li>
                    <li>
                      <NavLink
                        url="/admin/stations"
                        name="Trạm chơi"
                        Icon={Gamepad2}
                        active={isActive('/admin/stations')}
                      />
                    </li>
                    <li>
                      <NavLink url="/admin/staff" name="Nhân viên" Icon={Users} active={isActive('/admin/staff')} />
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="group flex cursor-pointer items-center gap-3 rounded-lg px-3"
              >
                <div className="from-primary/20 to-primary/40 text-primary ring-primary/10 flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br text-sm font-semibold ring-2 transition-all group-hover:ring-4">
                  {user.mssv.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.mssv}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-all ${showUserMenu ? 'rotate-180' : ''}`}
                />
              </div>
              {showUserMenu && <SubmenuHeader setShowUserMenu={setShowUserMenu} />}
            </div>
          ) : (
            <Link to="/login">
              <Button>Đăng nhập</Button>
            </Link>
          )}
        </div>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-all hover:bg-gray-100 lg:hidden"
        >
          {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {showMobileMenu && <MenuMobileHeader setShowMobileMenu={setShowMobileMenu} />}
    </header>
  );
};

export default Header;
