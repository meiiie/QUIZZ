// ========================================================================
// FILE: src/hooks/index.ts
// PURPOSE: Central exports for all custom hooks
// DESCRIPTION: Barrel file to export all teacher-focused React hooks
// ========================================================================

// ============= AUTHENTICATION =============
export { useAuth } from './useAuth';

// ============= QUIZ MANAGEMENT =============
export { useQuizzes } from './useQuizzes';

// ============= ANALYTICS & REPORTING =============
export { useAnalytics } from './useAnalytics';

// ============= COMBINED HOOKS OBJECT =============
import { useAuth } from './useAuth';
import { useQuizzes } from './useQuizzes';
import { useAnalytics } from './useAnalytics';

export const hooks = {
  auth: useAuth,
  quizzes: useQuizzes,
  analytics: useAnalytics,
} as const;

// ============= DEFAULT EXPORT =============
export default hooks;
