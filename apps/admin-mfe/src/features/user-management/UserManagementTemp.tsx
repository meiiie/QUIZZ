import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

interface UserManagementProps {
  users: User[];
  onAddUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => Promise<void>;
  onUpdateUser: (userId: number, userData: Partial<User>) => Promise<void>;
  onDeleteUser: (userId: number) => Promise<void>;
  onToggleUserStatus: (userId: number) => Promise<void>;
}

const UserManagement = ({ 
  users, 
  onAddUser,
  onUpdateUser,
  onDeleteUser, 
  onToggleUserStatus 
}: UserManagementProps) => {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student' as 'admin' | 'teacher' | 'student',
    status: 'active' as 'active' | 'inactive'
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'student',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'student',
      status: 'active'
    });
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      if (editingUser) {
        await onUpdateUser(editingUser.id, formData);
      } else {
        await onAddUser(formData);
      }
      handleCloseModal();
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (isAuthLoading) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  return (
    <div className="dashboard-main">
      <section className="user-controls">
        <div className="controls-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="teacher">Giáo viên</option>
              <option value="student">Học sinh</option>
            </select>
            
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>

          {currentUser?.role === 'admin' && (
            <button 
              className="add-user-btn"
              onClick={handleAddUser}
            >
              ➕ Thêm người dùng
            </button>
          )}
        </div>

        <div className="stats-row">
          <span className="result-count">
            Hiển thị {filteredUsers.length} / {users.length} người dùng
          </span>
        </div>
      </section>

      <section className="users-table-section">
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Đăng nhập cuối</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                const canEdit = currentUser?.role === 'admin';
                const canToggleStatus = currentUser?.role === 'admin' && currentUser.id !== user.id;
                const canDelete = currentUser?.role === 'admin' && currentUser.id !== user.id;

                return (
                  <tr key={user.id} className={user.status === 'inactive' ? 'inactive-row' : ''}>
                    <td>#{user.id}</td>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : 
                         user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status}`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                      </span>
                    </td>
                    <td>{user.createdAt}</td>
                    <td>{user.lastLogin || 'Chưa đăng nhập'}</td>
                    <td>
                      <div className="action-buttons">
                        {canEdit && (
                          <button 
                            className="edit-btn" 
                            title="Chỉnh sửa"
                            onClick={() => handleEditUser(user)}
                          >
                            ✏️
                          </button>
                        )}
                        
                        {canToggleStatus && (
                          <button 
                            className={`toggle-btn ${user.status}`}
                            onClick={() => onToggleUserStatus(user.id)}
                            title={user.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt'}
                          >
                            {user.status === 'active' ? '🔒' : '🔓'}
                          </button>
                        )}

                        {canDelete && (
                          <button 
                            className="delete-btn"
                            onClick={() => onDeleteUser(user.id)}
                            title="Xóa"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            
            <form onSubmit={handleSaveUser} className="user-form">
              <div className="form-group">
                <label htmlFor="name">Tên *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nhập tên người dùng"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Vai trò *</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                >
                  <option value="student">Học sinh</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Trạng thái *</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="btn-cancel"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="btn-save"
                >
                  {editingUser ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
