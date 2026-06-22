import { Gift, LogOut, PenLine } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { Button } from '~/components/ui/button';
import useAuth from '~/hooks/useAuth';
import { cn } from '~/lib/utils';

const NAV_ITEMS = [
  { url: '/staff', label: 'Chấm điểm', Icon: PenLine },
  { url: '/staff/rewards', label: 'Đổi thưởng', Icon: Gift },
];

const StaffLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-lg font-bold text-primary">EIU Staff</h1>
              <p className="text-sm text-muted-foreground">{user?.mssv}</p>
            </div>
            <nav className="hidden sm:flex">
              {NAV_ITEMS.map(({ url, label, Icon }) => (
                <Link
                  key={url}
                  to={url}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    location.pathname === url ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100',
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut size={16} className="mr-1" />
            Thoát
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
