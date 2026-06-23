import { Eye, EyeOff, IdCard, Lock } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import AuthApi from '~/api-requests/auth.requests';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { handleApiError } from '~/utils/handleApiError';
import PartitionBanner from '../Login/PartitionBanner';

const Register = () => {
  const navigate = useNavigate();
  const [mssv, setMssv] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      await AuthApi.register({ mssv, password, confirmPassword });
      toast.success('Đăng ký thành công!');
      navigate('/login');
    } catch (err) {
      handleApiError(err, 'Đăng ký thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid min-h-[520px] w-full grid-cols-1 overflow-hidden rounded-lg border border-gray-200/80 bg-white text-gray-700 sm:w-[580px] sm:grid-cols-2 lg:min-h-[720px] lg:w-[920px]">
      <PartitionBanner />
      <section className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12">
        <div className="mb-8 text-center sm:mb-10">
          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center sm:h-18 sm:w-18">
            <img src="/fcode.png" alt="F-Code" className="h-full w-full" />
            <div className="bg-primary/20 absolute inset-0 rounded-full opacity-50 blur-xl"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Đăng ký</h1>
          <p className="mt-2.5 text-sm text-gray-600 sm:text-base">Tạo tài khoản để tham gia sự kiện</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="mssv" className="mb-2.5 block text-sm font-medium text-gray-700">
              MSSV
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <IdCard className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="mssv"
                type="text"
                value={mssv}
                onChange={(e) => setMssv(e.target.value)}
                placeholder="Nhập MSSV"
                className="pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2.5 block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="pr-11 pl-11"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2.5 block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="pr-11 pl-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-4 text-gray-400 transition-colors hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </section>
    </section>
  );
};

export default Register;
