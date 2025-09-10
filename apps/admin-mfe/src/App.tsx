/**
 * Admin MFE - Feature-Sliced Design + MFE Best Practices
 * 
 * Triết lý MFE:
 * - Không có routing phức tạp (Host-Shell lo việc đó)
 * - Chỉ quản lý view state nội bộ đơn giản
 * - Giao tiếp với Host-Shell qua PostMessage
 * - Layout-agnostic: Host-Shell lo layout tổng thể
 * 
 * FSD Architecture:
 * - app: Khởi tạo và providers
 * - pages: Các trang/view hoàn chỉnh
 * - widgets: Các khối UI lớn (Sidebar, Header...)
 * - features: Các tính năng cụ thể
 * - entities: Business entities
 * - shared: Code tái sử dụng
 */

import { lazy, Suspense } from 'react';
import { ViewProvider, useView } from './shared/lib/viewManager';
import './App.css';

// Lazy load components để tránh circular imports
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));
const QuizManagementPage = lazy(() => import('./pages/QuizManagementPage'));
const SystemReportsPage = lazy(() => import('./pages/SystemReportsPage'));

// Loading component
const LoadingFallback = () => <div>Đang tải...</div>;

// Main content renderer - KHÔNG có Layout riêng, Host Shell sẽ lo
const AppContent = () => {
  const { currentView } = useView();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        );
      case 'user-management':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <UserManagementPage />
          </Suspense>
        );
      case 'quiz-management':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <QuizManagementPage />
          </Suspense>
        );
      case 'system-reports':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SystemReportsPage />
          </Suspense>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">View not found</h1>
            <p>The requested view "{currentView}" does not exist.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      {renderView()}
    </div>
  );
};

// Root App Component - Đơn giản như Student MFE
function App() {
  return (
    <ViewProvider initialView="dashboard">
      <AppContent />
    </ViewProvider>
  );
}

export default App;
