import { BarChart3, LogOut, MapPin, Users, UserCog } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { Button } from '~/components/ui/button';
import useAuth from '~/hooks/useAuth';
import { cn } from '~/lib/utils';

const NAV_ITEMS = [
  { url: '/admin', label: 'Dashboard', Icon: BarChart3 },
  { url: '/admin/stations', label: 'Trạm', Icon: MapPin },
  { url: '/admin/staff', label: 'Nhân sự', Icon: UserCog },
  { url: '/admin/players', label: 'Người chơi', Icon: Users },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (url: string) => (url === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(url));

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-r bg-white lg:flex">
        <div className="border-b p-4">
          <h1 className="text-xl font-bold text-primary">EIU Admin</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map(({ url, label, Icon }) => (
            <Link
              key={url}
              to={url}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive(url) ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
            <LogOut size={16} className="mr-2" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-3 lg:hidden">
          <h1 className="text-lg font-bold text-primary">EIU Admin</h1>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut size={16} />
          </Button>
        </header>
        <nav className="flex border-b bg-white px-4 lg:hidden">
          {NAV_ITEMS.map(({ url, label, Icon }) => (
            <Link
              key={url}
              to={url}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all',
                isActive(url) ? 'border-b-2 border-primary text-primary' : 'text-gray-500',
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
