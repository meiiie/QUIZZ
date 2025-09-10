import React, { useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, BrowserRouter } from 'react-router-dom';

// Import các trang
import Dashboard from './pages/Dashboard';
import QuanLyHocSinh from './pages/QuanLyHocSinh';
import QuanLyBaiKiemTra from './pages/QuanLyBaiKiemTra';
import TinhTrangHoanThanh from './pages/TinhTrangHoanThanh';
import ThongKe from './pages/ThongKe';
import TienDoHocSinh from './pages/TienDoHocSinh';
import TaoBaiKiemTra from './pages/TaoBaiKiemTra';
import QuanLyNhom from './pages/QuanLyNhom';
import BaoCaoKhoa from './pages/BaoCaoKhoa';
import QuanLyKhoa from './pages/QuanLyKhoa';

// Layout component
import Layout from './components/Layout';

// Component chính không có Router (cho Host Shell)
function AppContent() {
  console.log('AppContent - Component mounted/re-rendered');
  
  // Sử dụng useLocation từ Host Shell context
  const location = useLocation();
  
  console.log('AppContent - Current path:', location.pathname);
  console.log('AppContent - Will render Routes');
  
  // Conditional rendering thay vì Routes để tránh conflict
  const renderContent = useMemo(() => {
    console.log('AppContent - Creating content for path:', location.pathname);
    console.log('AppContent - Path starts with /teacher:', location.pathname.startsWith('/teacher'));
    console.log('AppContent - Exact path match /teacher/quizzes:', location.pathname === '/teacher/quizzes');
    
    // Redirect root to dashboard
    if (location.pathname === '/') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
    
    // Dashboard routes
    if (location.pathname === '/teacher/dashboard') {
      return <div><Dashboard /></div>;
    }
    
    // Student management
    if (location.pathname === '/teacher/quan-ly-hoc-sinh') {
      return <div><QuanLyHocSinh /></div>;
    }
    if (location.pathname === '/teacher/tien-do-hoc-sinh') {
      return <div><TienDoHocSinh /></div>;
    }
    
    // Quiz management
    if (location.pathname === '/teacher/quan-ly-bai-kiem-tra') {
      console.log('AppContent - Rendering quizzes page');
      return <div><QuanLyBaiKiemTra /></div>;
    }
    if (location.pathname === '/teacher/tinh-trang-hoan-thanh') {
      return <div><TinhTrangHoanThanh /></div>;
    }
    if (location.pathname === '/teacher/tao-bai-kiem-tra') {
      return <div><TaoBaiKiemTra /></div>;
    }
    
    // Analytics & Reports
    if (location.pathname === '/teacher/thong-ke') {
      return <div><ThongKe /></div>;
    }
    if (location.pathname === '/teacher/bao-cao-khoa') {
      return <div><BaoCaoKhoa /></div>;
    }
    
    // Department management
    if (location.pathname === '/teacher/quan-ly-khoa') {
      return <div><QuanLyKhoa /></div>;
    }
    
    // Group management
    if (location.pathname === '/teacher/quan-ly-nhom') {
      return <div><QuanLyNhom /></div>;
    }
    
    // Fallback - chỉ redirect khi không phải teacher route
    if (location.pathname.startsWith('/teacher')) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold text-red-600">Page Not Found</h2>
          <p className="text-gray-600">The requested page does not exist.</p>
          <p className="text-sm text-gray-500 mt-2">Current path: {location.pathname}</p>
        </div>
      );
    }
    
    return <Navigate to="/teacher/dashboard" replace />;
  }, [location.pathname]);
  
  // Debug: Log current path và check route matching
  console.log('AppContent - Final render with path:', location.pathname);
  
  return (
    <Layout>
      {renderContent}
    </Layout>
  );
}

// Layout cho chạy độc lập - navigation không có /teacher prefix
function StandaloneLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigation = [
    { name: 'Bảng Điều Khiển', href: '/dashboard' },
    { name: 'Quản Lý Học Sinh', href: '/quan-ly-hoc-sinh' },
    { name: 'Quản Lý Bài Kiểm Tra', href: '/quan-ly-bai-kiem-tra' },
    { name: 'Tạo Bài Kiểm Tra', href: '/tao-bai-kiem-tra' },
    { name: 'Quản Lý Khoa', href: '/quan-ly-khoa' },
    { name: 'Thống Kê', href: '/thong-ke' },
    { name: 'Báo Cáo Khoa', href: '/bao-cao-khoa' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">          
          <nav className="mt-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              console.log('Standalone Navigation item:', item.name, 'href:', item.href, 'isActive:', isActive);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Clicked standalone navigation:', item.name, 'href:', item.href);
                    // Sử dụng React Router để navigate
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

// Component cho chạy độc lập - routes không có /teacher prefix
function StandaloneAppContent() {
  return (
    <StandaloneLayout>
      <Routes>
        {/* Dashboard routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Student management */}
        <Route path="/quan-ly-hoc-sinh" element={<QuanLyHocSinh />} />
        <Route path="/tien-do-hoc-sinh" element={<TienDoHocSinh />} />
        
        {/* Quiz management */}
        <Route path="/quan-ly-bai-kiem-tra" element={<QuanLyBaiKiemTra />} />
        <Route path="/tinh-trang-hoan-thanh" element={<TinhTrangHoanThanh />} />
        <Route path="/tao-bai-kiem-tra" element={<TaoBaiKiemTra />} />
        
        {/* Analytics & Reports */}
        <Route path="/thong-ke" element={<ThongKe />} />
        <Route path="/bao-cao-khoa" element={<BaoCaoKhoa />} />
        
        {/* Department management */}
        <Route path="/quan-ly-khoa" element={<QuanLyKhoa />} />
        
        {/* Group management */}
        <Route path="/quan-ly-nhom" element={<QuanLyNhom />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </StandaloneLayout>
  );
}

// Component chính có Router (cho chạy độc lập)
function App() {
  // Kiểm tra xem có đang chạy trong Host Shell không
  // Host Shell sẽ có path bắt đầu bằng /teacher
  const isInHostShell = window.location.pathname.startsWith('/teacher');
  
  console.log('Teacher MFE - App component mounted/re-rendered');
  console.log('Teacher MFE - Current path:', window.location.pathname);
  console.log('Teacher MFE - Is in Host Shell:', isInHostShell);
  
  if (isInHostShell) {
    // Chạy trong Host Shell - không cần Router
    console.log('Teacher MFE - Running in Host Shell mode');
    return <AppContent />;
  } else {
    // Chạy độc lập - cần Router và routes khác
    console.log('Teacher MFE - Running in standalone mode');
    return (
      <BrowserRouter>
        <StandaloneAppContent />
      </BrowserRouter>
    );
  }
}

export default App;
