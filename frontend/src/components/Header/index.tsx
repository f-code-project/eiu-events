import { House, Menu, Users, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";

import { cn } from "~/lib/utils";
import { Button } from "../ui/button";

const NAV_ITEMS = [
  { url: "/", name: "Trang chủ", Icon: House },
  { url: "/teams", name: "Danh sách nhóm", Icon: Users },
];

const Header = () => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (url: string) =>
    url === "/" ? location.pathname === "/" : location.pathname.startsWith(url);

  return (
    <header className="sticky top-3 z-50 mt-6 rounded-lg border border-gray-200/60 bg-white/95 px-5 py-3.5 backdrop-blur-xl transition-all md:px-7">
      <div className="mx-auto flex max-w-7xl items-center">
        <Link
          to="/"
          className="group flex items-center gap-2.5 transition-all sm:gap-3"
        >
          <div className="relative">
            <img
              src="/fcode.png"
              alt="F-Code"
              className="h-8 w-8 transition-transform group-hover:scale-105 sm:h-9 sm:w-9"
            />
            <div className="bg-primary/20 absolute inset-0 rounded-full opacity-0 blur-md transition-opacity group-hover:opacity-100"></div>
          </div>
          <span className="text-primary text-xl font-bold tracking-tight sm:text-2xl">
            F-Code
          </span>
        </Link>

        <nav className="ml-12 hidden lg:block">
          <ul className="flex items-center gap-2">
            {NAV_ITEMS.map(({ url, name, Icon }) => (
              <li key={url}>
                <Link
                  to={url}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    isActive(url)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Icon size={18} />
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Link to="/login">
            <Button>Đăng nhập</Button>
          </Link>
        </div>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-all hover:bg-gray-100 lg:hidden"
        >
          {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {showMobileMenu && (
        <div className="mt-3 border-t border-gray-200/60 pt-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ url, name, Icon }) => (
              <li key={url}>
                <Link
                  to={url}
                  onClick={() => setShowMobileMenu(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                    isActive(url)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <Icon size={18} />
                  {name}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                <Button className="w-full">Đăng nhập</Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
