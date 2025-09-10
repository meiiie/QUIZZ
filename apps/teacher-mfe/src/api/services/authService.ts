// ========================================================================
// FILE: src/api/services/authService.ts
// PURPOSE: Authentication API service methods
// DESCRIPTION: All authentication-related API calls
// ========================================================================

import { httpClient } from '../httpClient';
import { ENDPOINTS } from '../endpoints';
import {
  User,
  AuthResponse,
  LoginRequest,
  ChangePasswordRequest,
} from '../../types';

export class AuthService {
  // ============= LOGIN & LOGOUT =============
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Store token after successful login
    if (response.token) {
      httpClient.setToken(response.token);
    }
    
    return response;
  }

  async getTeacherProfile(): Promise<any> {
    return httpClient.get<any>(ENDPOINTS.AUTH.PROFILE);
  }

  async updateTeacherProfile(profileData: any): Promise<any> {
    return httpClient.put<any>(ENDPOINTS.AUTH.PROFILE, profileData);
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post<void>(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Always clear local token, even if API call fails
      httpClient.clearToken();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      ENDPOINTS.AUTH.REFRESH
    );
    
    if (response.token) {
      httpClient.setToken(response.token);
    }
    
    return response;
  }

  // ============= PROFILE MANAGEMENT =============
  async getProfile(): Promise<User> {
    return httpClient.get<User>(ENDPOINTS.AUTH.PROFILE);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return httpClient.put<User>(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return httpClient.post<void>(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  // ============= TOKEN MANAGEMENT =============
  isAuthenticated(): boolean {
    return httpClient.isAuthenticated();
  }

  getToken(): string | null {
    return httpClient.getToken();
  }

  clearAuth(): void {
    httpClient.clearToken();
  }
}

// Singleton instance
export const authService = new AuthService();
export default authService;
