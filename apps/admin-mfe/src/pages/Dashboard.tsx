import { useView } from '../shared/lib/viewManager';
import { UsersIcon, ReportsIcon } from '../components/icons';
// import { useUserStore } from '../stores/userStore';

const Dashboard = () => {
  const { setView } = useView();
  // const { users, recentActivities } = useUserStore();
  
  // Mock data for now - will be replaced with real data later
  const users: any[] = [];
  const recentActivities: any[] = [];

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Cards (simplified) */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <UsersIcon size={32} color="var(--vmu-secondary)" />
              </div>
              <div className="stat-content">
                <h3>Tổng người dùng</h3>
                <p className="stat-number">{users.length}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <ReportsIcon size={32} color="#22c55e" />
              </div>
              <div className="stat-content">
                <h3>Hoạt động gần đây</h3>
                <p className="stat-number">{recentActivities.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions-section">
          <h2>Quản lý nhanh</h2>
          <div className="actions-grid">
            <button 
              className="action-btn secondary"
              onClick={() => setView('user-management')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <UsersIcon size={20} color="currentColor" />
              <span>Quản lý người dùng</span>
            </button>
            
            <button 
              className="action-btn tertiary"
              onClick={() => setView('system-reports')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <ReportsIcon size={20} color="currentColor" />
              <span>Xem báo cáo</span>
            </button>
          </div>
        </section>

        {/* Recent Activity: add/update/delete/toggle */}
        <section className="activity-section">
          <h2>Hoạt động gần đây</h2>
          <div className="activity-list">
            {recentActivities.slice(0, 8).map((act) => {
              const time = new Date(act.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              const actionText = act.type === 'create' ? 'được tạo'
                : act.type === 'update' ? 'được cập nhật'
                : act.type === 'delete' ? 'đã bị xóa'
                : 'đổi trạng thái';
              return (
                <div key={act.id} className="activity-item" onClick={() => setView('user-management')} style={{ cursor: 'pointer' }}>
                  <div className="activity-time">{time}</div>
                  <div className="activity-content">
                    <strong>{act.userName}</strong> ({act.userEmail}) {actionText}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
