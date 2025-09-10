import { useNavigate } from 'react-router-dom';
// import { useUserStore } from '../stores/userStore';

const SystemReportsPage = () => {
  const navigate = useNavigate();
  // const { users, recentActivities } = useUserStore();
  
  // Mock data for now - will be replaced with real data later
  const users: any[] = [];
  const recentActivities: any[] = [];

  const total = users.length;
  const active = users.filter(u => u.status === 'active').length;
  const inactive = users.filter(u => u.status === 'inactive').length;
  const admins = users.filter(u => u.role === 'admin').length;
  const teachers = users.filter(u => u.role === 'teacher').length;
  const students = users.filter(u => u.role === 'student').length;

  return (
    <div className="dashboard-main">
      <section className="page-header">
        <h1>📊 Báo cáo hệ thống</h1>
        <p>Tổng quan người dùng và hoạt động quản trị gần đây.</p>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <h3>Tổng người dùng</h3>
              <p className="stat-number">{total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>Hoạt động</h3>
              <p className="stat-number">{active}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>Ngừng hoạt động</h3>
              <p className="stat-number">{inactive}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>Admin</h3>
              <p className="stat-number">{admins}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>Giáo viên</h3>
              <p className="stat-number">{teachers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <h3>Sinh viên</h3>
              <p className="stat-number">{students}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="activity-section">
        <h2>Hoạt động gần đây</h2>
        <div className="activity-list">
          {recentActivities.length === 0 && (
            <div className="activity-item">
              <div className="activity-content">Chưa có hoạt động nào.</div>
            </div>
          )}
          {recentActivities.slice(0, 20).map((act) => {
            const time = new Date(act.timestamp).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
            const actionText = act.type === 'create' ? 'được tạo'
              : act.type === 'update' ? 'được cập nhật'
              : act.type === 'delete' ? 'đã bị xóa'
              : 'đổi trạng thái';
            return (
              <div key={act.id} className="activity-item" onClick={() => navigate('/user-management')} style={{ cursor: 'pointer' }}>
                <div className="activity-time">{time}</div>
                <div className="activity-content">
                  <strong>{act.userName}</strong> ({act.userEmail}) {actionText}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SystemReportsPage;
