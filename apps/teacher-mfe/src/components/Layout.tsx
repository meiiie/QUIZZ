import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = useMemo(() => [
    { name: 'Bảng Điều Khiển', href: '/teacher/dashboard' },
    { name: 'Quản Lý Học Sinh', href: '/teacher/quan-ly-hoc-sinh' },
    { name: 'Quản Lý Bài Kiểm Tra', href: '/teacher/quan-ly-bai-kiem-tra' },
    { name: 'Tạo Bài Kiểm Tra', href: '/teacher/tao-bai-kiem-tra' },
    { name: 'Quản Lý Khoa', href: '/teacher/quan-ly-khoa' },
    { name: 'Thống Kê', href: '/teacher/thong-ke' },
    { name: 'Báo Cáo Khoa', href: '/teacher/bao-cao-khoa' },
  ], []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-blue-600 text-white">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-semibold">Hệ thống quizz online</h1>
              <p className="text-blue-100 text-sm">Cổng thông tin giáo viên</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">          
          <nav className="mt-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              console.log('Layout - Navigation item:', item.name, 'href:', item.href, 'isActive:', isActive, 'currentPath:', location.pathname);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Layout - Clicked navigation:', item.name, 'href:', item.href, 'currentPath:', location.pathname);
                    // Sử dụng Host Shell Router để navigate
                    navigate(item.href);
                  }}
                  className={`flex items-center px-6 py-3 text-sm font-medium border-r-2 transition-colors ${
                    isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
