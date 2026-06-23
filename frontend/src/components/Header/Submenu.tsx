import { LogOut } from 'lucide-react';
import React from 'react';

import useAuth from '~/hooks/useAuth';

const SubmenuHeader = ({ setShowUserMenu }: { setShowUserMenu: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { user, logout } = useAuth();

  return (
    <div className="absolute top-full right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
      <div className="border-b border-gray-100 px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">{user?.mssv}</p>
        <p className="mt-0.5 text-xs text-gray-500">Vai trò: {user?.role}</p>
      </div>

      <div className="py-2">
        <button
          onClick={() => {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
              setShowUserMenu(false);
              logout();
            }
          }}
          className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default SubmenuHeader;
