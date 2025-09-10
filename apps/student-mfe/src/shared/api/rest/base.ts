/**
 * Base HTTP Client - Student MFE
 * 
 * Centralized fetch wrapper with error handling, logging, and configuration
 * Following modern API client patterns with proper error handling
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  baseURL: '/api',
  timeout: 30000,
  retries: 2,
  retryDelay: 1000,
} as const;

/**
 * HTTP Methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Request Configuration
 */
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

/**
 * API Response Type
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * API Error Type
 */
export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public response?: Response;

  constructor(
    message: string,
    status: number,
    statusText: string,
    response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

/**
 * Network Error Type
 */
export class NetworkError extends Error {
  public originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

/**
 * Request Timeout Error
 */
export class TimeoutError extends Error {
  constructor(timeout: number) {
    super(`Request timeout after ${timeout}ms`);
    this.name = 'TimeoutError';
  }
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Create timeout promise
 */
const createTimeoutPromise = (timeout: number): Promise<never> => 
  new Promise((_, reject) => 
    setTimeout(() => reject(new TimeoutError(timeout)), timeout)
  );

/**
 * Default headers for all requests
 */
const getDefaultHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

/**
 * Parse response based on content type
 */
const parseResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    return response.json();
  }
  
  if (contentType.includes('text/')) {
    return response.text();
  }
  
  // For other types, return as blob
  return response.blob();
};

/**
 * Check if error is retryable
 */
const isRetryableError = (error: any): boolean => {
  // Retry on network errors, timeouts, and 5xx server errors
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }
  
  if (error instanceof ApiError) {
    return error.status >= 500 && error.status < 600;
  }
  
  return false;
};

/**
 * Core HTTP client with retry logic
 */
const executeRequest = async (
  url: string, 
  config: RequestConfig = {},
  attempt: number = 1
): Promise<ApiResponse> => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = API_CONFIG.timeout,
    retries = API_CONFIG.retries,
    signal
  } = config;

  // Prepare request
  const requestHeaders = { ...getDefaultHeaders(), ...headers };
  const requestBody = body ? JSON.stringify(body) : undefined;
  
  // Log request (development only)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log(`🌐 API Request [${method}] ${url}`, {
      headers: requestHeaders,
      body: body || null,
      attempt
    });
  }

  try {
    // Create fetch promise with timeout
    const fetchPromise = fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      signal
    });

    // Race between fetch and timeout
    const response = await Promise.race([
      fetchPromise,
      createTimeoutPromise(timeout)
    ]);

    // Parse response
    const data = await parseResponse(response);

    // Check for HTTP errors
    if (!response.ok) {
      const errorMessage = data?.error || data?.message || response.statusText;
      throw new ApiError(
        errorMessage,
        response.status,
        response.statusText,
        response
      );
    }

    const apiResponse: ApiResponse = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };

    // Log successful response (development only)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log(`✅ API Success [${method}] ${url}`, {
        status: response.status,
        data: data
      });
    }

    return apiResponse;

  } catch (error: any) {
    // Handle different error types
    if (error instanceof TimeoutError || error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    const networkError = new NetworkError(
      `Network request failed: ${error.message}`,
      error
    );

    // Log error (development only)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.error(`❌ API Error [${method}] ${url}`, {
        error: error.message,
        attempt,
        willRetry: attempt < retries && isRetryableError(networkError)
      });
    }

    // Retry logic
    if (attempt < retries && isRetryableError(networkError)) {
      await sleep(API_CONFIG.retryDelay * attempt);
      return executeRequest(url, config, attempt + 1);
    }

    throw networkError;
  }
};

/**
 * Build full URL with base URL
 */
const buildUrl = (endpoint: string): string => {
  // Handle absolute URLs
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Combine base URL with endpoint
  return `${API_CONFIG.baseURL}/${cleanEndpoint}`;
};

/**
 * Main HTTP client class
 */
export class HttpClient {
  /**
   * Generic request method
   */
  async request<T = any>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = buildUrl(endpoint);
    return executeRequest(url, config);
  }

  /**
   * GET request
   */
  async get<T = any>(
    endpoint: string, 
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(
    endpoint: string, 
    body?: any, 
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    endpoint: string, 
    body?: any, 
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    endpoint: string, 
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    endpoint: string, 
    body?: any, 
    config: Omit<RequestConfig, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }
}

/**
 * Default HTTP client instance
 */
export const httpClient = new HttpClient();

/**
 * Convenience function for quick requests
 */
export const api = {
  get: <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    httpClient.get<T>(endpoint, config),
  
  post: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    httpClient.post<T>(endpoint, body, config),
  
  put: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    httpClient.put<T>(endpoint, body, config),
  
  delete: <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    httpClient.delete<T>(endpoint, config),
  
  patch: <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    httpClient.patch<T>(endpoint, body, config)
};
