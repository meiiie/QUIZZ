// ========================================================================
// FILE: src/api/services/index.ts
// PURPOSE: Central exports for all API services
// DESCRIPTION: Barrel file to export all teacher-focused API services
// ========================================================================

// ============= AUTHENTICATION & USER MANAGEMENT =============
export { authService, AuthService } from './authService';

// ============= ANALYTICS & REPORTING =============
export { 
  analyticsService, 
  AnalyticsService,
  type TeacherDashboardStats,
  type ClassAnalytics 
} from './analyticsService';

// ============= ASSIGNMENT MANAGEMENT =============
export { 
  assignmentService, 
  AssignmentService,
  type Assignment,
  type CreateAssignmentRequest,
  type UpdateAssignmentRequest,
  type AssignmentFilters,
  type AssignmentStats,
  type StudentAssignmentProgress
} from './assignmentService';

// ============= CLASS MANAGEMENT =============
export { classService, ClassService, type Class } from './classService';

// ============= DEPARTMENT OPERATIONS =============
export { departmentService, DepartmentService } from './departmentService';

// ============= GRADING & ASSESSMENT =============
export { 
  gradingService,
  GradingService,
  type QuizAttempt,
  type GradingOverview,
  type BulkGradingUpdate 
} from './gradingService';

// ============= QUIZ MANAGEMENT =============
export { quizService, QuizService } from './quizService';

// ============= STUDENT MANAGEMENT =============
export { 
  studentService, 
  StudentService,
  type TeacherStudentFilters
} from './studentService';

// ============= COMBINED API SERVICES OBJECT =============
import { authService } from './authService';
import { analyticsService } from './analyticsService';
import { assignmentService } from './assignmentService';
import { classService } from './classService';
import { departmentService } from './departmentService';
import { gradingService } from './gradingService';
import { quizService } from './quizService';
import { studentService } from './studentService';

export const apiServices = {
  auth: authService,
  analytics: analyticsService,
  assignments: assignmentService,
  classes: classService,
  departments: departmentService,
  grading: gradingService,
  quizzes: quizService,
  students: studentService,
} as const;

// ============= CONVENIENCE ALIAS =============
export const services = apiServices;

// ============= DEFAULT EXPORT =============
export default apiServices;
