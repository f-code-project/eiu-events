import {  Globe } from 'lucide-react';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-200/80 bg-linear-to-b from-white to-gray-50/50">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="col-span-1 sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/fcode.png" alt="F-Code" className="h-9 w-9" />
                <div className="bg-primary/20 absolute inset-0 rounded-full opacity-50 blur-lg"></div>
              </div>
              <span className="text-primary text-2xl font-bold tracking-tight">F-Code</span>
            </div>
            <p className="mt-4 text-justify text-sm leading-relaxed text-gray-600">
              F-Code, thành lập năm 2014, là câu lạc bộ học thuật đầu tiên của Đại học FPT tại Thành phố Hồ Chí Minh.
              Ban đầu hướng đến việc tạo ra một cộng đồng cho sinh viên chuyên ngành Kỹ thuật Phần mềm, F-Code cho phép
              họ chia sẻ và cải thiện các kỹ năng cần thiết cho lập trình viên. Sau 11 năm, F-Code đã cung cấp nhiều
              hoạt động khác nhau cho sinh viên.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Liên kết</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="/" className="hover:text-primary group flex items-center text-sm text-gray-600 transition-all">
                  <span className="group-hover:bg-primary mr-2 h-1 w-1 rounded-full bg-gray-400 transition-all group-hover:w-2"></span>
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary group flex items-center text-sm text-gray-600 transition-all">
                  <span className="group-hover:bg-primary mr-2 h-1 w-1 rounded-full bg-gray-400 transition-all group-hover:w-2"></span>
                  Timeline
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary group flex items-center text-sm text-gray-600 transition-all">
                  <span className="group-hover:bg-primary mr-2 h-1 w-1 rounded-full bg-gray-400 transition-all group-hover:w-2"></span>
                  Đề tài
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/WvudrJaYD"
                  className="hover:text-primary group flex items-center text-sm text-gray-600 transition-all"
                >
                  <span className="group-hover:bg-primary mr-2 h-1 w-1 rounded-full bg-gray-400 transition-all group-hover:w-2"></span>
                  Discord
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Recruitment Leader</h3>
            <ul className="mt-4 space-y-2.5">
              <li className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Project:</span> Trần Ngọc Thanh
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Plan:</span> Đào Thị Út Trinh
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">HR:</span> Nguyễn Huy Phong
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Media:</span> Vũ Việt Quang
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Technical:</span> Phạm Hoàng Tuấn
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Challenge 1:</span> Nguyễn Hoàng Minh
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Challenge 2:</span> Võ Gia Huy
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Challenge 3:</span> Phạm Hoàng Tuấn
              </li>
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Liên hệ</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/fcodeclub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:bg-primary group hover:border-primary flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-xs transition-all hover:scale-110 hover:text-white"
              >
                {/* <Facebook className="h-4 w-4" /> */}
              </a>
              <a
                href="https://www.youtube.com/channel/UCZyrUXSrQ1AdkomxYz1GvCw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:bg-primary group hover:border-primary flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-xs transition-all hover:scale-110 hover:text-white"
                >
                  {/* <Youtube className="h-4 w-4" /> */}
              </a>
              <a
                href="https://fcodehcm.wordpress.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:bg-primary group hover:border-primary flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-xs transition-all hover:scale-110 hover:text-white"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 sm:mt-10 sm:pt-8">
          <p className="text-center text-sm text-gray-500">
            Dự án được thiết kế bởi:{' '}
            <Link
              className="text-primary font-medium transition-colors hover:underline"
              target="_blank"
              to="https://www.facebook.com/fcodeclub"
            >
              CLB F-Code
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
