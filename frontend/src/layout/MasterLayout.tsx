import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import Footer from '~/components/Footer';
import Header from '~/components/Header';
import ScrollToTop from '~/components/ScrollToTop';
import useAuth from '~/hooks/useAuth';
import LocalStorage from '~/utils/localStorage';

const MasterLayout = () => {
  const { isAuthenticated, isLoading, fetchUser } = useAuth();

  useEffect(() => {
    const isLoggedIn = LocalStorage.getItem('login');
    if (isLoggedIn && !isAuthenticated) {
      fetchUser();
    }
  }, []);

  ScrollToTop();

  return (
    <section className="flex min-h-screen flex-col justify-between bg-linear-to-b from-gray-100/50 to-white px-4 xl:px-6">
      <section>
        <Header />
        <section className="mx-auto my-8 max-w-7xl sm:my-12">
          <Outlet />
        </section>
      </section>
      <Footer />
      <Toaster
        expand={true}
        richColors
        position="top-center"
        visibleToasts={5}
        theme="system"
        toastOptions={{ duration: 4000, closeButton: true }}
      />
    </section>
  );
};

export default MasterLayout;
