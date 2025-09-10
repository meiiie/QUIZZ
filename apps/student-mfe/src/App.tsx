/**
 * Student MFE - Professional Design with CSS Isolation
 * 
 * Features:
 * - CSS Modules for style isolation
 * - Professional UI/UX design
 * - Standalone and host integration compatibility
 * - Responsive design
 * - Dark mode support
 * 
 * FSD Architecture:
 * - app: Khởi tạo và providers
 * - pages: Các trang/view hoàn chỉnh
 * - widgets: Các khối UI lớn (Sidebar, Header...)
 * - features: Các tính năng cụ thể
 * - entities: Business entities
 * - shared: Code tái sử dụng
 */

import AppProviders from './app/providers/AppProviders';
import { ViewProvider, useView } from './shared/lib/viewManager';
import { TopHeader } from './widgets/TopHeader';
import { Sidebar } from './widgets/Sidebar';
import StudentDashboardPage from './pages/StudentDashboardPage';
import QuizListPage from './pages/QuizListPage';
import TakeQuizPage from './pages/TakeQuizPage';
import { QuizHistoryPage } from './pages/QuizHistoryPage';
import StudentMFEWrapper from './components/StudentMFEWrapper';
import styles from './styles/student-mfe.module.css';

// Main content renderer
const AppContent = () => {
  const { currentView, viewParams } = useView();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <StudentDashboardPage />;
      case 'quizzes':
        return <QuizListPage />;
      case 'take-quiz':
        return <TakeQuizPage quizId={viewParams.quizId} />;
      case 'history':
        return <QuizHistoryPage />;
      case 'profile':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>
            <p>Manage your student profile and settings.</p>
          </div>
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
    <div className={styles.studentMfeContainer}>
      {/* Top Header with User Dropdown - Left Aligned */}
      <TopHeader />
      
      <div className={styles.studentMfeLayout}>
        {/* Sidebar - Navigation Widget - Fixed Container */}
        <div className={styles.studentMfeSidebar}>
          <Sidebar />
        </div>
        
        {/* Main Content - Pages */}
        <main className={styles.studentMfeMainContent}>
          {renderView()}
        </main>
      </div>
    </div>
  );
};

// Root App Component
function App() {
  return (
    <StudentMFEWrapper>
      <AppProviders>
        <ViewProvider initialView="dashboard">
          <AppContent />
        </ViewProvider>
      </AppProviders>
    </StudentMFEWrapper>
  );
}

export default App;
