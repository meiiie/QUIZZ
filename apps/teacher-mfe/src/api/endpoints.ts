// ========================================================================
// FILE: src/api/endpoints.ts
// PURPOSE: Teacher-focused API endpoint constants and configuration
// DESCRIPTION: Centralized API endpoints for Teacher MFE backend integration
// ========================================================================

// ============= BASE CONFIGURATION =============
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const API_VERSION = 'v1';
export const API_PREFIX = `${API_BASE_URL}/${API_VERSION}`;

// ============= TEACHER AUTHENTICATION ENDPOINTS =============
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_PREFIX}/teacher/auth/login`,
  LOGOUT: `${API_PREFIX}/teacher/auth/logout`,
  REFRESH: `${API_PREFIX}/teacher/auth/refresh`,
  PROFILE: `${API_PREFIX}/teacher/auth/profile`,
  UPDATE_PROFILE: `${API_PREFIX}/teacher/auth/profile`,
  CHANGE_PASSWORD: `${API_PREFIX}/teacher/auth/change-password`,
} as const;

// ============= TEACHER PROFILE ENDPOINTS =============
export const TEACHER_ENDPOINTS = {
  PROFILE: `${API_PREFIX}/teacher/profile`,
  UPDATE_PROFILE: (_id: string) => `${API_PREFIX}/teacher/profile`,
  DASHBOARD_STATS: `${API_PREFIX}/teacher/dashboard`,
  MY_STUDENTS: `${API_PREFIX}/teacher/my-students`,
  MY_QUIZZES: `${API_PREFIX}/teacher/my-quizzes`,
} as const;

// ============= STUDENT MANAGEMENT (TEACHER VIEW) =============
export const STUDENT_ENDPOINTS = {
  // View students in teacher's departments/classes
  LIST: `${API_PREFIX}/teacher/students`,
  GET_BY_ID: (id: string) => `${API_PREFIX}/teacher/students/${id}`,
  
  // Student progress and analytics (teacher view)
  PROGRESS: (id: string) => `${API_PREFIX}/teacher/students/${id}/progress`,
  QUIZ_ATTEMPTS: (id: string) => `${API_PREFIX}/teacher/students/${id}/quiz-attempts`,
  
  // Student management (limited teacher permissions)
  UPDATE: (id: string) => `${API_PREFIX}/teacher/students/${id}`,
  
  // Bulk operations
  EXPORT: `${API_PREFIX}/teacher/students/export`,
  IMPORT_GRADES: `${API_PREFIX}/teacher/students/import-grades`,
} as const;

// ============= DEPARTMENT ENDPOINTS (TEACHER VIEW) =============
export const DEPARTMENT_ENDPOINTS = {
  // View teacher's department and related departments
  LIST: `${API_PREFIX}/teacher/departments`,
  MY_DEPARTMENT: `${API_PREFIX}/teacher/departments/my-department`,
  GET_BY_ID: (id: string) => `${API_PREFIX}/teacher/departments/${id}`,
  
  // Department students and statistics
  STUDENTS: (id: string) => `${API_PREFIX}/teacher/departments/${id}/students`,
  STATISTICS: (id: string) => `${API_PREFIX}/teacher/departments/${id}/statistics`,
} as const;

// ============= QUIZ MANAGEMENT (TEACHER-FOCUSED) =============
export const QUIZ_ENDPOINTS = {
  // Teacher's quiz CRUD operations
  LIST: `${API_PREFIX}/teacher/quizzes`,
  GET_BY_ID: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}`,
  CREATE: `${API_PREFIX}/teacher/quizzes`,
  UPDATE: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}`,
  DELETE: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}`,
  DUPLICATE: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/duplicate`,
  
  // Quiz status management
  PUBLISH: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/publish`,
  ARCHIVE: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/archive`,
  
  // Questions management
  QUESTIONS: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/questions`,
  ADD_QUESTION: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/questions`,
  UPDATE_QUESTION: (quizId: string, questionId: string) => 
    `${API_PREFIX}/teacher/quizzes/${quizId}/questions/${questionId}`,
  DELETE_QUESTION: (quizId: string, questionId: string) => 
    `${API_PREFIX}/teacher/quizzes/${quizId}/questions/${questionId}`,
  REORDER_QUESTIONS: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/questions/reorder`,
  
  // Quiz results and analytics (teacher view)
  ATTEMPTS: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/attempts`,
  ATTEMPT_DETAILS: (quizId: string, attemptId: string) => 
    `${API_PREFIX}/teacher/quizzes/${quizId}/attempts/${attemptId}`,
  STATISTICS: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/statistics`,
  EXPORT_RESULTS: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/export-results`,
  
  // Grade management
  GRADE_ATTEMPT: (quizId: string, attemptId: string) => 
    `${API_PREFIX}/teacher/quizzes/${quizId}/attempts/${attemptId}/grade`,
  BULK_GRADE: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/bulk-grade`,
  
  // Quiz assignment integration
  ASSIGN: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/assign`,
  UNASSIGN: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/unassign`,
  ASSIGNMENTS: (id: string) => `${API_PREFIX}/teacher/quizzes/${id}/assignments`,
  
  // Quiz templates and helpers
  TEMPLATES: `${API_PREFIX}/teacher/quizzes/templates`,
  CREATE_FROM_TEMPLATE: (templateId: string) => `${API_PREFIX}/teacher/quizzes/templates/${templateId}/create`,
  VALIDATE: `${API_PREFIX}/teacher/quizzes/validate`,
  
  // Bulk operations
  BULK_UPDATE: `${API_PREFIX}/teacher/quizzes/bulk-update`,
  BULK_DELETE: `${API_PREFIX}/teacher/quizzes/bulk-delete`,
  BULK_ASSIGN: `${API_PREFIX}/teacher/quizzes/bulk-assign`,
} as const;

// ============= TEACHER ANALYTICS & REPORTING =============
export const ANALYTICS_ENDPOINTS = {
  // Teacher dashboard analytics
  TEACHER_DASHBOARD: `${API_PREFIX}/teacher/analytics/dashboard`,
  
  // Class and student analytics
  MY_CLASSES_STATS: `${API_PREFIX}/teacher/analytics/my-classes`,
  STUDENT_PROGRESS: `${API_PREFIX}/teacher/analytics/student-progress`,
  QUIZ_PERFORMANCE: `${API_PREFIX}/teacher/analytics/quiz-performance`,
  
  // Department analytics (for department heads)
  DEPARTMENT_STATS: `${API_PREFIX}/teacher/analytics/department`,
  
  // Activity tracking
  RECENT_ACTIVITIES: `${API_PREFIX}/teacher/analytics/activities`,
  
  // Export capabilities
  EXPORT_REPORT: `${API_PREFIX}/teacher/analytics/export-report`,
  EXPORT_GRADES: `${API_PREFIX}/teacher/analytics/export-grades`,
} as const;

// ============= CLASS MANAGEMENT ENDPOINTS =============
export const CLASS_ENDPOINTS = {
  // Teacher's classes
  MY_CLASSES: `${API_PREFIX}/teacher/classes`,
  GET_CLASS: (id: string) => `${API_PREFIX}/teacher/classes/${id}`,
  CLASS_STUDENTS: (id: string) => `${API_PREFIX}/teacher/classes/${id}/students`,
  CLASS_QUIZZES: (id: string) => `${API_PREFIX}/teacher/classes/${id}/quizzes`,
  CLASS_STATISTICS: (id: string) => `${API_PREFIX}/teacher/classes/${id}/statistics`,
} as const;

// ============= GRADING ENDPOINTS =============
export const GRADING_ENDPOINTS = {
  // Grading overview
  OVERVIEW: `${API_PREFIX}/teacher/grading/overview`,
  
  // Pending grading tasks
  PENDING: `${API_PREFIX}/teacher/grading/pending`,
  PENDING_GRADES: `${API_PREFIX}/teacher/grading/pending`,
  
  // Attempt details and grading
  ATTEMPT_DETAILS: (attemptId: string) => `${API_PREFIX}/teacher/grading/attempts/${attemptId}`,
  GRADE_ATTEMPT: (attemptId: string) => `${API_PREFIX}/teacher/grading/attempts/${attemptId}/grade`,
  
  // Grade management
  UPDATE_GRADE: (gradeId: string) => `${API_PREFIX}/teacher/grading/${gradeId}`,
  BULK_GRADE: `${API_PREFIX}/teacher/grading/bulk-grade`,
  
  // Grading analytics and summaries
  QUIZ_OVERVIEW: (quizId: string) => `${API_PREFIX}/teacher/grading/quiz/${quizId}/overview`,
  CLASS_SUMMARY: (classId: string) => `${API_PREFIX}/teacher/grading/class/${classId}/summary`,
  
  // Export and statistics
  EXPORT: `${API_PREFIX}/teacher/grading/export`,
  STATISTICS: `${API_PREFIX}/teacher/grading/statistics`,
  GRADE_DISTRIBUTION: `${API_PREFIX}/teacher/grading/distribution`,
  GRADE_HISTORY: `${API_PREFIX}/teacher/grading/history`,
} as const;

// ============= ASSIGNMENT MANAGEMENT ENDPOINTS =============
export const ASSIGNMENT_ENDPOINTS = {
  // Assignment CRUD operations
  LIST: `${API_PREFIX}/teacher/assignments`,
  GET_BY_ID: (id: string) => `${API_PREFIX}/teacher/assignments/${id}`,
  CREATE: `${API_PREFIX}/teacher/assignments`,
  UPDATE: (id: string) => `${API_PREFIX}/teacher/assignments/${id}`,
  DELETE: (id: string) => `${API_PREFIX}/teacher/assignments/${id}`,
  DUPLICATE: (id: string) => `${API_PREFIX}/teacher/assignments/${id}/duplicate`,
  
  // Assignment status management
  PUBLISH: (id: string) => `${API_PREFIX}/teacher/assignments/${id}/publish`,
  SCHEDULE: (id: string) => `${API_PREFIX}/teacher/assignments/${id}/schedule`,
  ARCHIVE: (id: string) => `${API_PREFIX}/teacher/assignments/${id}/archive`,
  
  // Student assignment management
  ADD_STUDENTS: (id: string) => `${API_PREFIX}/teacher/assignments/${id}/students/add`,
  REMOVE_STUDENTS: (id: string) => `${API_PREFIX}/teacher/assignments/${id}/students/remove`,
  STUDENTS: (id: string) => `${API_PREFIX}/teacher/assignments/${id}/students`,
  
  // Assignment analytics
  STATS: `${API_PREFIX}/teacher/assignments/stats`,
  PROGRESS: (id: string) => `${API_PREFIX}/teacher/assignments/${id}/progress`,
  
  // Bulk operations
  BULK_UPDATE: `${API_PREFIX}/teacher/assignments/bulk-update`,
  BULK_DELETE: `${API_PREFIX}/teacher/assignments/bulk-delete`,
  
  // Assignment templates
  TEMPLATES: `${API_PREFIX}/teacher/assignments/templates`,
  CREATE_FROM_TEMPLATE: (templateId: string) => `${API_PREFIX}/teacher/assignments/templates/${templateId}/create`,
  
  // Assignment validation
  VALIDATE: `${API_PREFIX}/teacher/assignments/validate`,
  CHECK_CONFLICTS: `${API_PREFIX}/teacher/assignments/check-conflicts`,
} as const;

// ============= TEACHER FILE UPLOAD ENDPOINTS =============
export const UPLOAD_ENDPOINTS = {
  // Profile and quiz media uploads
  AVATAR: `${API_PREFIX}/teacher/upload/avatar`,
  QUIZ_MEDIA: `${API_PREFIX}/teacher/upload/quiz-media`,
  
  // Bulk uploads
  STUDENT_IMPORT: `${API_PREFIX}/teacher/upload/students-import`,
  GRADE_IMPORT: `${API_PREFIX}/teacher/upload/grades-import`,
  
  // File management
  DELETE: (filename: string) => `${API_PREFIX}/teacher/upload/${filename}`,
} as const;

// ============= TEACHER NOTIFICATIONS =============
export const NOTIFICATION_ENDPOINTS = {
  // Teacher notifications
  LIST: `${API_PREFIX}/teacher/notifications`,
  MARK_READ: (id: string) => `${API_PREFIX}/teacher/notifications/${id}/read`,
  MARK_ALL_READ: `${API_PREFIX}/teacher/notifications/mark-all-read`,
  
  // Send notifications to students
  SEND_REMINDER: `${API_PREFIX}/teacher/notifications/send-reminder`,
  SEND_QUIZ_NOTIFICATION: `${API_PREFIX}/teacher/notifications/quiz-notification`,
} as const;
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item.toString()));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export const buildEndpointWithQuery = (endpoint: string, params: Record<string, any>): string => {
  return `${endpoint}${buildQueryString(params)}`;
};

// ============= ENDPOINT GROUPS FOR EASY ACCESS =============
export const ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  TEACHER: TEACHER_ENDPOINTS,
  STUDENTS: STUDENT_ENDPOINTS,
  DEPARTMENTS: DEPARTMENT_ENDPOINTS,
  QUIZZES: QUIZ_ENDPOINTS,
  ASSIGNMENTS: ASSIGNMENT_ENDPOINTS,
  CLASSES: CLASS_ENDPOINTS,
  ANALYTICS: ANALYTICS_ENDPOINTS,
  GRADING: GRADING_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  NOTIFICATIONS: NOTIFICATION_ENDPOINTS,
} as const;

export default ENDPOINTS;
