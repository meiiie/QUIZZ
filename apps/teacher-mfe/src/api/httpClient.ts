// ========================================================================
// FILE: src/api/httpClient.ts
// PURPOSE: HTTP client configuration and interceptors
// DESCRIPTION: Centralized HTTP client with error handling and auth
// ========================================================================

import { ApiError, ApiResponse, PaginationParams } from '../types';

// ============= HTTP CLIENT CLASS =============
export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // ============= TOKEN MANAGEMENT =============
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  // ============= REQUEST HEADERS =============
  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getAuthToken();
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // ============= ERROR HANDLING =============
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      let errorDetails: any = null;
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorDetails = errorData;
        } else {
          errorMessage = await response.text();
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
      }
      
      const apiError = new ApiError(
        errorMessage,
        response.status,
        errorDetails
      );
      
      // Handle specific status codes
      if (response.status === 401) {
        this.removeAuthToken();
        window.location.href = '/login';
      }
      
      throw apiError;
    }

    try {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text() as unknown as T;
      }
    } catch (parseError) {
      throw new ApiError('Failed to parse response', 500, parseError);
    }
  }

  // ============= HTTP METHODS =============
  
  async get<T>(
    endpoint: string, 
    params?: Record<string, any>,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => url.searchParams.append(key, item.toString()));
          } else {
            url.searchParams.append(key, value.toString());
          }
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(customHeaders),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string, 
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    
    const headers = this.getHeaders(customHeaders);
    let body: string | FormData | undefined;

    if (data instanceof FormData) {
      delete headers['Content-Type']; // Let browser set it with boundary
      body = data;
    } else if (data) {
      body = JSON.stringify(data);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string, 
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    
    const headers = this.getHeaders(customHeaders);
    let body: string | FormData | undefined;

    if (data instanceof FormData) {
      delete headers['Content-Type'];
      body = data;
    } else if (data) {
      body = JSON.stringify(data);
    }

    const response = await fetch(url.toString(), {
      method: 'PUT',
      headers,
      body,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(
    endpoint: string, 
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    
    const headers = this.getHeaders(customHeaders);
    let body: string | FormData | undefined;

    if (data instanceof FormData) {
      delete headers['Content-Type'];
      body = data;
    } else if (data) {
      body = JSON.stringify(data);
    }

    const response = await fetch(url.toString(), {
      method: 'PATCH',
      headers,
      body,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(
    endpoint: string,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);

    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: this.getHeaders(customHeaders),
    });

    return this.handleResponse<T>(response);
  }

  // ============= FILE UPLOAD METHODS =============
  async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, string>
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.post<T>(endpoint, formData);
  }

  async uploadMultipleFiles<T>(
    endpoint: string,
    files: File[],
    fieldName: string = 'files',
    additionalData?: Record<string, string>
  ): Promise<T> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append(fieldName, file);
    });
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.post<T>(endpoint, formData);
  }

  // ============= AUTHENTICATION METHODS =============
  setToken(token: string): void {
    this.setAuthToken(token);
  }

  clearToken(): void {
    this.removeAuthToken();
  }

  getToken(): string | null {
    return this.getAuthToken();
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // ============= PAGINATION HELPERS =============
  async getPaginated<T>(
    endpoint: string,
    params?: PaginationParams & Record<string, any>
  ): Promise<ApiResponse<T[]>> {
    return this.get<ApiResponse<T[]>>(endpoint, params);
  }
}

// ============= SINGLETON INSTANCE =============
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5176/api';
export const httpClient = new HttpClient(API_BASE_URL);

// ============= CONVENIENCE FUNCTIONS =============
export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>) => 
    httpClient.get<T>(endpoint, params),
  
  post: <T>(endpoint: string, data?: any) => 
    httpClient.post<T>(endpoint, data),
  
  put: <T>(endpoint: string, data?: any) => 
    httpClient.put<T>(endpoint, data),
  
  patch: <T>(endpoint: string, data?: any) => 
    httpClient.patch<T>(endpoint, data),
  
  delete: <T>(endpoint: string) => 
    httpClient.delete<T>(endpoint),
  
  upload: <T>(endpoint: string, file: File, fieldName?: string) => 
    httpClient.uploadFile<T>(endpoint, file, fieldName),
  
  uploadMultiple: <T>(endpoint: string, files: File[], fieldName?: string) => 
    httpClient.uploadMultipleFiles<T>(endpoint, files, fieldName),
};

export default httpClient;
