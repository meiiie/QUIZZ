import { useState } from 'react';
// import { useAuth } from '../../stores/authStore';
// import { useUserStore } from '../../stores/userStore';
import { UserPlusIcon, FileUploadIcon, DownloadIcon } from '../../components/icons';
import ExcelImport from '../../components/ExcelImport';
import PasswordGenerator from '../../components/PasswordGenerator';
import { exportUsersToExcel, exportPasswordTemplate, exportCredentialsCsv, exportPasswordList, UserAccount } from '../../utils/excelExporter';
import { generatePassword, defaultPasswordOptions } from '../../utils/passwordGenerator';

export interface User {
  id: number;
  name: string;
  email: string;
  studentid?: string;
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
  // const { user: currentUser, isLoading: isAuthLoading } = useAuth();
  // const { 
  //   searchTerm, 
  //   selectedRole, 
  //   selectedStatus, 
  //   setSearchTerm, 
  //   setSelectedRole, 
  //   setSelectedStatus 
  // } = useUserStore();
  
  // Mock data for now - will be replaced with real data later
  const currentUser = { id: 1, role: 'admin' };
  const isAuthLoading = false;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Filter users locally to avoid infinite loop
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.studentid ? user.studentid.toLowerCase().includes(searchTerm.toLowerCase()) : false);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelImportOpen, setIsExcelImportOpen] = useState(false);
  const [isPasswordGeneratorOpen, setIsPasswordGeneratorOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'admin' | 'teacher' | 'student',
    status: 'active' as 'active' | 'inactive'
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      status: 'active'
    });
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      status: 'active'
    });
  };

  const handleExcelImport = async (data: any[]) => {
    try {
      const createdCredentials: Array<{ name: string; email: string; password: string; role: 'admin' | 'teacher' | 'student'; studentid?: string }> = [];
      for (const userData of data) {
        const password = generatePassword(defaultPasswordOptions);
        await onAddUser({
          ...userData,
          password: password
        });
        createdCredentials.push({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          password,
          ...(userData.studentid ? { studentid: userData.studentid } : {})
        });
      }

      // Immediately offer download of credentials for the imported batch
      if (createdCredentials.length > 0) {
        exportCredentialsCsv(createdCredentials, 'tai_khoan_moi_import');
      }
    } catch (error) {
      throw error;
    }
  };

  const handlePasswordGenerated = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
  };

  const handleMultiplePasswordsGenerated = (passwords: string[]) => {
    // For now, just use the first password
    if (passwords.length > 0) {
      setFormData(prev => ({ ...prev, password: passwords[0] }));
    }
  };

  const handleExportUsers = () => {
    const userAccounts: UserAccount[] = users.map(user => ({
      ...user,
      password: '' as unknown as string
    }));
    exportUsersToExcel(userAccounts, { includePasswords: false });
  };

  const handleExportPasswordList = () => {
    const userAccounts: UserAccount[] = users.map(user => ({
      ...user,
      password: generatePassword(defaultPasswordOptions) // Generate new password for export
    }));
    exportPasswordList(userAccounts);
  };

  const handleDownloadTemplate = () => {
    exportPasswordTemplate();
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

  const handleChangeUserRole = async (userId: number, newRole: 'admin' | 'teacher' | 'student') => {
    try {
      await onUpdateUser(userId, { role: newRole });
    } catch (error: any) {
      alert(`Lỗi khi cập nhật vai trò: ${error.message}`);
    }
  };

  // filteredUsers is now provided by the store

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
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                className="add-user-btn"
                onClick={handleAddUser}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <UserPlusIcon size={16} color="currentColor" />
                Thêm người dùng
              </button>
              
              <button 
                className="excel-import-btn"
                onClick={() => setIsExcelImportOpen(true)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  background: 'var(--vmu-accent)',
                  color: 'var(--vmu-text)',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}
              >
                <FileUploadIcon size={16} color="currentColor" />
                Import Excel
              </button>

              <button 
                onClick={handleExportUsers}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  background: 'var(--vmu-success)',
                  color: 'var(--vmu-white)',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}
              >
                <DownloadIcon size={16} color="currentColor" />
                Xuất Excel
              </button>

              <button 
                onClick={handleExportPasswordList}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  background: 'var(--vmu-warning)',
                  color: 'var(--vmu-white)',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}
              >
                <DownloadIcon size={16} color="currentColor" />
                Xuất Mật Khẩu
              </button>
            </div>
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
                <th>Mã SV</th>
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
                const canChangeRole = currentUser?.role === 'admin';
                const isSelf = currentUser?.id === user.id;
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
                    <td>{user.role === 'student' ? (user.studentid || '—') : '—'}</td>
                    <td>{user.email}</td>
                    <td>
                      {canChangeRole ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeUserRole(user.id, e.target.value as any)}
                          disabled={isSelf}
                          className="filter-select"
                          style={{ minWidth: '8rem' }}
                        >
                          <option value="admin">Admin</option>
                          <option value="teacher">Giáo viên</option>
                          <option value="student">Học sinh</option>
                        </select>
                      ) : (
                        <span className={`role-badge role-${user.role}`}>
                          {user.role === 'admin' ? 'Admin' : 
                           user.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status}`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                      </span>
                    </td>
                    <td>{user.createdAt}</td>
                    <td>{user.lastLogin || 'Chưa đăng nhập'}</td>
                    <td>
                      <div className="action-buttons" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-start' }}>
                        <button 
                          className={`toggle-btn ${user.status}`}
                          onClick={() => onToggleUserStatus(user.id)}
                          title={user.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt'}
                          disabled={isSelf}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--vmu-border)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.375rem',
                            cursor: isSelf ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {user.status === 'active' ? '🔒' : '🔓'}
                        </button>

                        <button 
                          className="delete-btn"
                          onClick={() => {
                            if (isSelf) return;
                            const ok = confirm(`Xóa tài khoản ${user.name} (${user.email})?`);
                            if (ok) onDeleteUser(user.id);
                          }}
                          title="Xóa"
                          disabled={isSelf}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--vmu-border)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.375rem',
                            cursor: isSelf ? 'not-allowed' : 'pointer'
                          }}
                        >
                          🗑️
                        </button>
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
                <label htmlFor="password">Mật khẩu {editingUser ? '(để trống nếu không đổi)' : '*'}</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={editingUser ? "Nhập mật khẩu mới (tùy chọn)" : "Nhập mật khẩu"}
                    required={!editingUser}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordGeneratorOpen(true)}
                    style={{
                      background: 'var(--vmu-secondary)',
                      color: 'var(--vmu-white)',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                    title="Tạo mật khẩu tự động"
                  >
                    🔐
                  </button>
                </div>
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

      {/* Excel Import Modal */}
      <ExcelImport
        isOpen={isExcelImportOpen}
        onClose={() => setIsExcelImportOpen(false)}
        onImport={handleExcelImport}
        onDownloadTemplate={handleDownloadTemplate}
        title="Import danh sách người dùng từ Excel"
      />

      {/* Password Generator Modal */}
      <PasswordGenerator
        isOpen={isPasswordGeneratorOpen}
        onClose={() => setIsPasswordGeneratorOpen(false)}
        onPasswordGenerated={handlePasswordGenerated}
        onMultiplePasswordsGenerated={handleMultiplePasswordsGenerated}
      />
    </div>
  );
};

export default UserManagement;
