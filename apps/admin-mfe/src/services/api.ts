// API Service Layer for VMU Admin Dashboard
import { User } from '../features/user-management/UserManagement';
import { config } from '../config/env';

const API_BASE_URL = config.api.baseUrl;


// Custom error class for API errors
export class ApiError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// HTTP client with error handling
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
        0,
        error
      );
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create HTTP client instance
const httpClient = new HttpClient(API_BASE_URL);

// Auth API
export const authApi = {
  getCurrentUser: (): Promise<User> => {
    return httpClient.get<User>('/auth/me');
  },

  login: (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    return httpClient.post<{ user: User; token: string }>('/auth/login', credentials);
  },

  logout: (): Promise<void> => {
    return httpClient.post<void>('/auth/logout');
  },

  refreshToken: (): Promise<{ token: string }> => {
    return httpClient.post<{ token: string }>('/auth/refresh');
  },
};

// Users API
export const usersApi = {
  getUsers: (): Promise<User[]> => {
    return httpClient.get<User[]>('/users');
  },

  getUserById: (id: number): Promise<User> => {
    return httpClient.get<User>(`/users/${id}`);
  },

  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'> & { password?: string }): Promise<User> => {
    return httpClient.post<User>('/users', userData);
  },

  updateUser: (id: number, userData: Partial<User>): Promise<User> => {
    return httpClient.put<User>(`/users/${id}`, userData);
  },

  deleteUser: (id: number): Promise<void> => {
    return httpClient.delete<void>(`/users/${id}`);
  },

  toggleUserStatus: (id: number): Promise<User> => {
    return httpClient.patch<User>(`/users/${id}/toggle-status`);
  },

  searchUsers: (query: string): Promise<User[]> => {
    return httpClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
  },
};

// Quiz API (placeholder for future implementation)
export const quizApi = {
  getQuizzes: (): Promise<any[]> => {
    return httpClient.get<any[]>('/quizzes');
  },

  getQuizById: (id: number): Promise<any> => {
    return httpClient.get<any>(`/quizzes/${id}`);
  },

  createQuiz: (quizData: any): Promise<any> => {
    return httpClient.post<any>('/quizzes', quizData);
  },

  updateQuiz: (id: number, quizData: any): Promise<any> => {
    return httpClient.put<any>(`/quizzes/${id}`, quizData);
  },

  deleteQuiz: (id: number): Promise<void> => {
    return httpClient.delete<void>(`/quizzes/${id}`);
  },
};

// Reports API (placeholder for future implementation)
export const reportsApi = {
  getDashboardStats: (): Promise<any> => {
    return httpClient.get<any>('/reports/dashboard');
  },

  getUserStats: (): Promise<any> => {
    return httpClient.get<any>('/reports/users');
  },

  getQuizStats: (): Promise<any> => {
    return httpClient.get<any>('/reports/quizzes');
  },
};

// Export all APIs
export const api = {
  auth: authApi,
  users: usersApi,
  quiz: quizApi,
  reports: reportsApi,
};

export default api;
