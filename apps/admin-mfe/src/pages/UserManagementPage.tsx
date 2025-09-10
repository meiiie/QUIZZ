// src/pages/UserManagementPage.tsx

import { useEffect } from 'react';
import UserManagement from '../features/user-management/UserManagement';
// import { useAuth, useAuthStore } from '../stores/authStore';
// import { useUserStore, useUsers, useUsersLoading, useUsersError } from '../stores/userStore';
import { UserTableSkeleton } from '../components/Skeleton';

const UserManagementPage = () => {
  // const { user: currentUser, isLoading: authLoading } = useAuth();
  // const users = useUsers();
  // const loading = useUsersLoading();
  // const error = useUsersError();
  // const { fetchUsers, createUser, updateUser, deleteUser, toggleUserStatus } = useUserStore();
  
  // Mock data for now - will be replaced with real data later
  const currentUser = { role: 'admin' };
  const authLoading = false;
  const users: any[] = [];
  const loading = false;
  const error = null;
  const fetchUsers = () => {};
  const createUser = async () => {};
  const updateUser = async () => {};
  const deleteUser = async () => {};
  const toggleUserStatus = async () => {};

  // Bypass authentication for development
  // TODO: Remove this in production
  useEffect(() => {
    if (!authLoading && (!currentUser || currentUser.role !== 'admin')) {
      // For development, create a mock admin user
      // const mockAdmin = {
      //   id: 1,
      //   name: 'Admin Development',
      //   email: 'admin@vimaru.edu.vn',
      //   role: 'admin' as const,
      //   status: 'active' as const,
      //   createdAt: '2024-01-01',
      //   lastLogin: '2024-08-18'
      // };
      
      // Set mock user in store
      // useAuthStore.getState().setUser(mockAdmin);
    }
  }, [authLoading, currentUser]);

  // Gọi API khi component được mount
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array để chỉ chạy một lần

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang xác thực...</p>
      </div>
    );
  }

  if (loading) {
    return <UserTableSkeleton />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Lỗi tải dữ liệu</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <UserManagement 
      users={users}
      onAddUser={createUser}
      onUpdateUser={updateUser}
      onDeleteUser={deleteUser}
      onToggleUserStatus={toggleUserStatus}
    />
  );
};

export default UserManagementPage;