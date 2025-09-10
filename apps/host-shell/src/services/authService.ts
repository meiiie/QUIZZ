// ========================================================================
// FILE: src/services/authService.ts
// PURPOSE: Authentication API service layer
// FEATURES: Type-safe API calls, error handling, token management
// ARCHITECTURE: Clean separation of concerns, easy testing
// ========================================================================

import type { LoginCredentials, AuthResponse, User } from '../store/authStore';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

// Custom error class for authentication errors
export class AuthError extends Error {
  public statusCode?: number;
  public code?: string;

  constructor(
    message: string,
    statusCode?: number,
    code?: string
  ) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

// HTTP client with error handling
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AuthError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof AuthError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new AuthError('Request timeout', 408, 'TIMEOUT');
        }
        throw new AuthError(`Network error: ${error.message}`, 0, 'NETWORK_ERROR');
      }
      
      throw new AuthError('Unknown error occurred', 0, 'UNKNOWN_ERROR');
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Initialize API client
const apiClient = new ApiClient(API_BASE_URL, API_TIMEOUT);

// Authentication service
export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validate input
      if (!credentials.email?.trim()) {
        throw new AuthError('Email không được để trống', 400, 'VALIDATION_ERROR');
      }
      
      if (!credentials.password?.trim()) {
        throw new AuthError('Mật khẩu không được để trống', 400, 'VALIDATION_ERROR');
      }

      // For development: Mock API response
      if (import.meta.env.DEV) {
        return this.mockLogin(credentials);
      }

      // Real API call
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      });

      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Đăng nhập thất bại. Vui lòng thử lại.', 500, 'LOGIN_FAILED');
    }
  }

  static async logout(token: string): Promise<void> {
    try {
      if (import.meta.env.DEV) {
        // Mock logout - just simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      }

      await apiClient.post('/auth/logout', {}, {
        'Authorization': `Bearer ${token}`
      });
    } catch (error) {
      // Don't throw on logout errors in production
      console.error('Logout error:', error);
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      if (import.meta.env.DEV) {
        throw new AuthError('Refresh token not implemented in development', 501, 'NOT_IMPLEMENTED');
      }

      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refreshToken
      });

      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Token refresh failed', 401, 'TOKEN_REFRESH_FAILED');
    }
  }

  static async getCurrentUser(token: string): Promise<User> {
    try {
      if (import.meta.env.DEV) {
        throw new AuthError('Get current user not implemented in development', 501, 'NOT_IMPLEMENTED');
      }

      const response = await apiClient.get<User>('/auth/me', {
        'Authorization': `Bearer ${token}`
      });

      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Failed to get user info', 500, 'USER_INFO_FAILED');
    }
  }

  static async changePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      if (import.meta.env.DEV) {
        // Mock change password
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
      }

      await apiClient.put('/auth/change-password', {
        currentPassword,
        newPassword
      }, {
        'Authorization': `Bearer ${token}`
      });
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Đổi mật khẩu thất bại', 500, 'PASSWORD_CHANGE_FAILED');
    }
  }

  // Mock login for development
  private static async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation
    if (credentials.email === 'admin@test.com' && credentials.password === 'wrong') {
      throw new AuthError('Sai mật khẩu', 401, 'INVALID_CREDENTIALS');
    }

    // Determine user role based on email pattern
    const isStudent = credentials.email.includes('student') || /^\d+/.test(credentials.email);
    const isTeacher = credentials.email.includes('teacher') || credentials.email.includes('gv');
    const isAdmin = credentials.email.includes('admin');
    
    const role = isAdmin ? 'admin' : isTeacher ? 'teacher' : 'student';
    
    const mockUser: User = {
      id: `user_${Date.now()}`,
      name: isStudent ? 'Nguyễn Văn A' : isTeacher ? 'TS. Nguyễn Thị B' : 'Admin User',
      email: credentials.email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.email)}&background=random`,
      ...(isStudent && { studentId: '2024001234' }),
      ...(isTeacher && { employeeId: 'GV001234' })
    };

    return {
      user: mockUser,
      token: `jwt_token_${Date.now()}_${role}`,
      refreshToken: `refresh_token_${Date.now()}`,
      expiresIn: 3600 // 1 hour
    };
  }
}

// Export for easy access
export default AuthService;
