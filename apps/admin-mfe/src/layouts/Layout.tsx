import { useView } from '../shared/lib/viewManager';
import { useAuth } from '../stores/authStore';
import { DashboardIcon, UsersIcon, QuizIcon, ReportsIcon, ArrowLeftIcon, LogoutIcon } from '../components/icons';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentView, setView } = useView();
  const { user: currentUser, logout } = useAuth();

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Quiz Admin Dashboard';
      case 'user-management':
        return 'Quản lý người dùng';
      case 'quiz-management':
        return 'Quản lý câu hỏi';
      case 'system-reports':
        return 'Báo cáo hệ thống';
      default:
        return 'Quiz Admin Dashboard';
    }
  };

  const getPageIcon = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardIcon size={24} color="var(--vmu-white)" />;
      case 'user-management':
        return <UsersIcon size={24} color="var(--vmu-white)" />;
      case 'quiz-management':
        return <QuizIcon size={24} color="var(--vmu-white)" />;
      case 'system-reports':
        return <ReportsIcon size={24} color="var(--vmu-white)" />;
      default:
        return <DashboardIcon size={24} color="var(--vmu-white)" />;
    }
  };

  // Check if we're not on the main dashboard page
  const isOnDashboard = currentView === 'dashboard';
  const showBackButton = !isOnDashboard;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {getPageIcon()}
            <h1 className="header-title">{getPageTitle()}</h1>
          </div>
          <div className="header-user">
            {showBackButton && (
              <button 
                className="back-btn"
                onClick={() => setView('dashboard')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ArrowLeftIcon size={16} color="currentColor" />
                Về Dashboard
              </button>
            )}
            <span className="user-name">{currentUser?.name || 'Admin User'}</span>
            <button 
              className="logout-btn" 
              onClick={() => logout()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogoutIcon size={16} color="currentColor" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  );
};

export default Layout;
