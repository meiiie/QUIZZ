/**
 * MSW Browser Setup - Student MFE
 * 
 * Configure and export the service worker for browser environment
 * Professional-grade mock service worker configuration
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * Configure MSW worker with our API handlers
 * This will intercept all network requests in development
 */
export const worker = setupWorker(...handlers);

// Log MSW status for development debugging
if (import.meta.env.DEV) {
  console.log('🔧 MSW: Mock Service Worker configured');
  console.log('📡 Intercepting API calls:', handlers.length, 'handlers loaded');
  
  // Log all handlers being registered (simplified for MSW 2.x)
  console.log('📋 MSW: Registered endpoints:');
  console.log('   - GET /api/test (test endpoint)');
  console.log('   - GET /api/quizzes');
  console.log('   - GET /api/quizzes/:id');
  console.log('   - GET /api/quizzes/category/:category');
  console.log('   - GET /api/quizzes/:id/questions');
  console.log('   - POST /api/quiz-attempts');
  console.log('   - PUT /api/quiz-attempts/:id/submit');
}
