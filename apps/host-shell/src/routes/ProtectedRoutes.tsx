// ========================================================================
// FILE: src/routes/ProtectedRoutes.tsx
// PURPOSE: Simple route protection for MFE architecture
// USAGE: Protects routes based on user roles
// ========================================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  allowedRoles: ('student' | 'teacher' | 'admin')[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuthStore();

  if (!user) {
    // Nếu chưa đăng nhập, đá về trang login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Nếu đã đăng nhập nhưng sai vai trò, đá về trang không có quyền (hoặc login)
    return <Navigate to="/login" replace />; // Có thể tạo trang Unauthorized sau
  }
  
  // Nếu mọi thứ đều ổn, cho phép hiển thị component con (MFE)
  return <Outlet />;
};

export default ProtectedRoute;
