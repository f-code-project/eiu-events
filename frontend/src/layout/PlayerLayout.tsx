import { LogOut } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { Button } from '~/components/ui/button';
import useAuth from '~/hooks/useAuth';

const PlayerLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-primary">EIU Events</h1>
            <p className="text-sm text-muted-foreground">MSSV: {user?.mssv}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut size={16} className="mr-1" />
            Thoát
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PlayerLayout;
