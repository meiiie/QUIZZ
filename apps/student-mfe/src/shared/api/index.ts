/**
 * API Facade - Student MFE
 * 
 * Single entry point for all API operations following facade pattern
 * Provides unified interface and environment-aware API selection
 */

import type { QuizAnswer } from '../../entities/quiz/model/types';
import type { 
  QuizAttempt, 
  QuizHistoryStats, 
  QuizHistoryFilter 
} from '../../entities/history/model/types';

// Development environment check
const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';

/**
 * Environment Configuration
 */
export const API_CONFIG = {
  isDevelopment,
  useMSW: isDevelopment, // Use MSW in development
  apiUrl: isDevelopment ? '/api' : '/api' // Could be extended for production API URL
} as const;

/**
 * Import API implementations
 */
// REST API (production & fallback)
import { quizApi as restQuizApi } from './rest/quiz';
import { api as restApi } from './rest/base';

/**
 * Dynamically import MSW only in development
 */
const initializeMSW = async () => {
  if (!API_CONFIG.useMSW) {
    console.log('🔧 API: Production mode - using REST API');
    return false;
  }

  try {
    // Dynamic import to avoid bundling MSW in production
    const { worker } = await import('./msw/browser');
    
    // Start MSW with more permissive settings
    await worker.start({
      onUnhandledRequest: 'warn',
      quiet: false, // Show detailed logs
      waitUntilReady: true, // Wait for full initialization
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
          scope: '/'
        }
      }
    });

    console.log('🎭 API: MSW enabled for development');
    return true;
  } catch (error) {
    console.warn('⚠️ API: MSW initialization failed, falling back to REST API', error);
    return false;
  }
};

/**
 * API Selection Strategy
 * Automatically chooses between MSW (development) and REST (production)
 */
class ApiManager {
  private mswInitialized = false;
  private initPromise: Promise<boolean> | null = null;

  /**
   * Initialize API based on environment
   */
  async initialize(): Promise<boolean> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private async performInitialization(): Promise<boolean> {
    if (API_CONFIG.useMSW && !this.mswInitialized) {
      const success = await initializeMSW();
      this.mswInitialized = success;
      return success;
    }
    return false;
  }

  /**
   * Check if MSW is available and working
   */
  async isMSWWorking(): Promise<boolean> {
    if (!this.mswInitialized) {
      return false;
    }

    try {
      // Test MSW with a simple request
      const response = await fetch('/api/test');
      const data = await response.json();
      return data?.message?.includes('MSW') || false;
    } catch {
      return false;
    }
  }

  /**
   * Get the appropriate API implementation
   */
  async getApiImplementation() {
    await this.initialize();
    
    const mswWorking = await this.isMSWWorking();
    
    if (mswWorking) {
      console.log('🎭 API: Using MSW (Mock Service Worker)');
      return {
        type: 'msw' as const,
        api: restApi, // MSW intercepts fetch calls, so we use the same REST client
        quiz: restQuizApi
      };
    } else {
      console.log('🌐 API: Using REST API');
      return {
        type: 'rest' as const,
        api: restApi,
        quiz: restQuizApi
      };
    }
  }
}

/**
 * Global API manager instance
 */
const apiManager = new ApiManager();

/**
 * Unified Quiz API Interface
 * Provides consistent interface regardless of underlying implementation
 */
export const quizAPI = {
  /**
   * Initialize the API system
   */
  async initialize() {
    return apiManager.initialize();
  },

  /**
   * Test API connectivity
   */
  async test() {
    const implementation = await apiManager.getApiImplementation();
    return implementation.quiz.test();
  },

  /**
   * Get all available quizzes
   */
  async getQuizzes() {
    const implementation = await apiManager.getApiImplementation();
    return implementation.quiz.getAllQuizzes();
  },

  /**
   * Get quiz by ID
   */
  async getQuiz(id: string) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.quiz.getQuiz(id);
  },

  /**
   * Get quizzes by category
   */
  async getQuizzesByCategory(category: string) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.quiz.getByCategory(category);
  },

  /**
   * Get questions for a quiz
   */
  async getQuizQuestions(quizId: string) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.quiz.getQuestions(quizId);
  },

  /**
   * Start a new quiz attempt
   */
  async startQuizAttempt(quizId: string, userId?: string) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.quiz.startAttempt(quizId, userId);
  },

  /**
   * Submit quiz attempt
   */
  async submitQuizAttempt(attemptId: string, answers: QuizAnswer[]) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.quiz.submitAttempt(attemptId, answers);
  }
};

/**
 * Generic HTTP client facade
 */
export const httpAPI = {
  /**
   * Initialize the API system
   */
  async initialize() {
    return apiManager.initialize();
  },

  /**
   * GET request
   */
  async get<T = unknown>(endpoint: string, config?: Record<string, unknown>) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.api.get<T>(endpoint, config);
  },

  /**
   * POST request
   */
  async post<T = unknown>(endpoint: string, body?: unknown, config?: Record<string, unknown>) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.api.post<T>(endpoint, body, config);
  },

  /**
   * PUT request
   */
  async put<T = unknown>(endpoint: string, body?: unknown, config?: Record<string, unknown>) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.api.put<T>(endpoint, body, config);
  },

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string, config?: Record<string, unknown>) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.api.delete<T>(endpoint, config);
  },

  /**
   * PATCH request
   */
  async patch<T = unknown>(endpoint: string, body?: unknown, config?: Record<string, unknown>) {
    const implementation = await apiManager.getApiImplementation();
    return implementation.api.patch<T>(endpoint, body, config);
  }
};

/**
 * API Status and Debug Information
 */
export const apiStatus = {
  /**
   * Get current API configuration
   */
  getConfig() {
    return API_CONFIG;
  },

  /**
   * Get API implementation details
   */
  async getImplementation() {
    const implementation = await apiManager.getApiImplementation();
    return {
      type: implementation.type,
      mswInitialized: apiManager['mswInitialized'],
      environment: API_CONFIG
    };
  },

  /**
   * Force reinitialization of API
   */
  async reinitialize() {
    apiManager['initPromise'] = null;
    apiManager['mswInitialized'] = false;
    return apiManager.initialize();
  }
};

/**
 * Quiz History API Methods
 */
export const historyAPI = {
  /**
   * Get quiz completion history
   */
  async getHistory(filter?: QuizHistoryFilter): Promise<QuizAttempt[]> {
    try {
      console.log('🌐 API: Fetching quiz history...');
      
      // Build query parameters from filter
      const queryParams = new URLSearchParams();
      if (filter?.subject) queryParams.append('subject', filter.subject);
      if (filter?.dateFrom) queryParams.append('dateFrom', filter.dateFrom);
      if (filter?.dateTo) queryParams.append('dateTo', filter.dateTo);
      if (filter?.status) queryParams.append('status', filter.status);
      
      const url = `/api/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ API: Quiz history fetched successfully:', data.length, 'records');
      return data;
      
    } catch (error) {
      console.error('❌ API: Failed to fetch quiz history:', error);
      throw new Error('Unable to load quiz history. Please try again.');
    }
  },

  /**
   * Get quiz history statistics
   */
  async getStats(): Promise<QuizHistoryStats> {
    try {
      console.log('🌐 API: Fetching quiz history stats...');
      
      const response = await fetch('/api/history/stats');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ API: Quiz history stats fetched successfully');
      return data;
      
    } catch (error) {
      console.error('❌ API: Failed to fetch quiz history stats:', error);
      throw new Error('Unable to load quiz statistics. Please try again.');
    }
  },

  /**
   * Get specific quiz attempt details
   */
  async getAttemptDetails(attemptId: string): Promise<QuizAttempt> {
    try {
      console.log('🌐 API: Fetching quiz attempt details...', attemptId);
      
      const response = await fetch(`/api/history/${attemptId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ API: Quiz attempt details fetched successfully');
      return data;
      
    } catch (error) {
      console.error('❌ API: Failed to fetch quiz attempt details:', error);
      throw new Error('Unable to load quiz attempt details. Please try again.');
    }
  }
};

/**
 * Global API Facade
 * Unified interface for all API operations
 */
export const api = {
  quiz: quizAPI,
  history: historyAPI,
  
  /**
   * Initialize API system
   */
  async initialize() {
    return quizAPI.initialize();
  },

  /**
   * Test API connectivity
   */
  async test() {
    return quizAPI.test();
  },

  /**
   * Reset API state (for testing)
   */
  async reset() {
    apiManager['initPromise'] = null;
    apiManager['mswInitialized'] = false;
    return apiManager.initialize();
  }
};

/**
 * Default exports for backward compatibility
 */
export default quizAPI;

/**
 * Re-export commonly used types and utilities
 */
export type { QuizAnswer } from './rest/quiz';
