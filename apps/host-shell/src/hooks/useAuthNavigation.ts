// ========================================================================
// FILE: src/hooks/useAuthNavigation.ts
// PURPOSE: Custom hook for authentication-aware navigation
// FEATURES: Role-based routing, redirect handling, loading states
// ========================================================================

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '../store/authStore';

interface UseAuthNavigationOptions {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export const useAuthNavigation = (options: UseAuthNavigationOptions = {}) => {
  const {
    requireAuth = false,
    allowedRoles = [],
    redirectTo = '/login',
    onUnauthorized
  } = options;

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  const getRoleBasedRedirect = (role: UserRole): string => {
    switch (role) {
      case 'student':
        return '/student';
      case 'teacher':
        return '/teacher';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  const canAccess = (): boolean => {
    if (!requireAuth) return true;
    if (!isAuthenticated) return false;
    if (allowedRoles.length === 0) return true;
    return user ? allowedRoles.includes(user.role) : false;
  };

  const redirectToLogin = () => {
    navigate(redirectTo, {
      state: { from: location.pathname },
      replace: true
    });
  };

  const redirectToRole = () => {
    if (user) {
      const roleRedirect = getRoleBasedRedirect(user.role);
      navigate(roleRedirect, { replace: true });
    }
  };

  const redirectToUnauthorized = () => {
    if (onUnauthorized) {
      onUnauthorized();
    } else {
      navigate('/unauthorized', { replace: true });
    }
  };

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      redirectToLogin();
      return;
    }

    if (isAuthenticated && allowedRoles.length > 0 && user) {
      if (!allowedRoles.includes(user.role)) {
        redirectToUnauthorized();
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requireAuth, allowedRoles.length]);

  return {
    canAccess: canAccess(),
    isLoading,
    user,
    isAuthenticated,
    redirectToLogin,
    redirectToRole,
    redirectToUnauthorized,
    getRoleBasedRedirect
  };
};

export default useAuthNavigation;
