// ========================================================================
// FILE: src/hooks/useAuth.ts
// PURPOSE: Authentication hook for teacher login and session management
// DESCRIPTION: Custom hook to manage teacher authentication state
// ========================================================================

import { useState, useEffect, useCallback } from 'react';
import { authService } from '../api/services';

interface AuthState {
  isAuthenticated: boolean;
  teacher: any | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    teacher: null,
    loading: true,
    error: null,
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setAuthState(prev => ({ ...prev, loading: true }));
        
        const token = localStorage.getItem('teacher_token');
        if (!token) {
          setAuthState({
            isAuthenticated: false,
            teacher: null,
            loading: false,
            error: null,
          });
          return;
        }

        // Verify token and get teacher profile
        const teacher = await authService.getTeacherProfile();
        setAuthState({
          isAuthenticated: true,
          teacher,
          loading: false,
          error: null,
        });
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('teacher_token');
        setAuthState({
          isAuthenticated: false,
          teacher: null,
          loading: false,
          error: 'Session expired',
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authService.login({ email, password });
      
      // Store token
      localStorage.setItem('teacher_token', response.token);
      
      // Get teacher profile
      const teacher = await authService.getTeacherProfile();
      
      setAuthState({
        isAuthenticated: true,
        teacher,
        loading: false,
        error: null,
      });
      
      return true;
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Login failed',
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('teacher_token');
      setAuthState({
        isAuthenticated: false,
        teacher: null,
        loading: false,
        error: null,
      });
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const teacher = await authService.getTeacherProfile();
      setAuthState(prev => ({
        ...prev,
        teacher,
      }));
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Failed to refresh profile',
      }));
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
    refreshProfile,
  };
};
