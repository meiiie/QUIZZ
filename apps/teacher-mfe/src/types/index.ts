// ========================================================================
// FILE: src/types/index.ts
// PURPOSE: Central type definitions for Teacher MFE
// DESCRIPTION: All interfaces, types, and enums for API integration
// ========================================================================

// ============= USER & AUTHENTICATION =============
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student' | 'admin';
  avatar?: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// ============= DEPARTMENT =============
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headId?: string; // Teacher ID who heads the department
  createdAt: string;
  updatedAt: string;
}

// ============= STUDENT =============
export interface Student {
  id: string;
  studentId: string; // Student code like IT001, ECO002
  name: string;
  email: string;
  avatar?: string;
  departmentId: string;
  department?: Department; // Populated field
  classId?: string;
  enrollmentYear: number;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: string;
  updatedAt: string;
}

// ============= ERROR HANDLING =============
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============= STUDENT PROGRESS =============
export interface StudentProgress {
  studentId: string;
  student?: Student; // Populated field
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  percentage: number;
  lastActivity: string;
  status: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

// ============= QUIZ =============
export interface Quiz {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  departmentId: string;
  department?: Department; // Populated field
  teacherId: string;
  teacher?: User; // Populated field
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'active' | 'completed' | 'archived';
  totalQuestions: number;
  duration: number; // in minutes
  passingScore: number; // percentage
  maxAttempts: number;
  isRandomized: boolean;
  showResultsImmediately: boolean;
  availableFrom?: string;
  availableUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  type: 'multiple_choice' | 'single_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[]; // For multiple choice questions
  correctAnswer: string | string[]; // Can be single or multiple
  explanation?: string;
  points: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quiz?: Quiz; // Populated field
  studentId: string;
  student?: Student; // Populated field
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // in seconds
  score: number;
  totalPoints: number;
  percentage: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  answers: QuizAnswer[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // in seconds
}

// ============= STATISTICS & ANALYTICS =============
export interface DashboardStats {
  totalQuizzes: number;
  totalStudents: number;
  totalAttempts: number;
  averageScore: number;
  activeQuizzes: number;
  completedQuizzes: number;
  draftQuizzes: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: 'quiz_created' | 'quiz_completed' | 'student_registered' | 'quiz_graded';
  description: string;
  userId?: string;
  user?: User;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface DepartmentStats {
  departmentId: string;
  department?: Department;
  totalStudents: number;
  completedQuizzes: number;
  averageScore: number;
  completionRate: number;
  topPerformers: Student[];
  strugglingStudents: Student[];
}

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// ============= FORM TYPES =============
export interface CreateQuizRequest {
  title: string;
  description: string;
  instructions?: string;
  departmentId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  passingScore: number;
  maxAttempts: number;
  isRandomized: boolean;
  showResultsImmediately: boolean;
  availableFrom?: string;
  availableUntil?: string;
  questions: Omit<QuizQuestion, 'id' | 'quizId' | 'createdAt' | 'updatedAt'>[];
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {
  status?: 'draft' | 'active' | 'completed' | 'archived';
}

export interface SubmitQuizRequest {
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  timeSpent: number;
}

// ============= AUTHENTICATION FORM TYPES =============
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'teacher' | 'student';
  departmentId?: string;
}

// ============= FILTER & SORT TYPES =============
export type QuizStatus = 'all' | 'draft' | 'active' | 'completed' | 'archived';
export type StudentStatus = 'all' | 'active' | 'inactive' | 'graduated';
export type DifficultyLevel = 'all' | 'easy' | 'medium' | 'hard';

export interface QuizFilters {
  status?: QuizStatus;
  difficulty?: DifficultyLevel;
  departmentId?: string;
  teacherId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface StudentFilters {
  status?: StudentStatus;
  departmentId?: string;
  classId?: string;
  enrollmentYear?: number;
  progressStatus?: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

// ============= ASSIGNMENT TYPES =============
export interface Assignment {
  id: string;
  name: string;
  description?: string;
  notes?: string;
  
  // Quiz Configuration
  quizIds: string[];
  quizzes?: Quiz[]; // Populated field
  
  // Timing Configuration
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  noDates: boolean;
  
  // Settings Configuration
  maxAttempts: number;
  showCorrectAnswers: 'never' | 'always' | 'after-due-date' | 'after-first-attempt' | 'after-last-attempt' | 'after-each-attempt';
  showCorrectnessMarks: 'never' | 'always' | 'after-due-date' | 'after-each-attempt';
  showPointsPossible: boolean;
  showEarnedScore: boolean;
  allowRetake: boolean;
  
  // Question Configuration
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  showTimeRemaining: boolean;
  protectedWithPassword: boolean;
  password?: string;
  
  // Student Selection
  studentIds: string[];
  students?: Student[]; // Populated field
  assignToAll: boolean;
  assignToFutureStudents: boolean;
  
  // Department & Teacher
  departmentId: string;
  department?: Department; // Populated field
  teacherId: string;
  teacher?: User; // Populated field
  
  // Status & Metadata
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssignmentRequest {
  name: string;
  description?: string;
  notes?: string;
  
  // Quiz Configuration
  quizIds: string[];
  
  // Timing Configuration
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  noDates: boolean;
  
  // Settings Configuration
  maxAttempts: number;
  showCorrectAnswers: string;
  showCorrectnessMarks: string;
  showPointsPossible: boolean;
  showEarnedScore: boolean;
  allowRetake: boolean;
  
  // Question Configuration
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  showTimeRemaining: boolean;
  protectedWithPassword: boolean;
  password?: string;
  
  // Student Selection
  studentIds: string[];
  assignToAll: boolean;
  assignToFutureStudents: boolean;
  
  // Department
  departmentId: string;
}

export interface UpdateAssignmentRequest extends Partial<CreateAssignmentRequest> {
  id: string;
}

export interface AssignmentFilters {
  status?: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';
  departmentId?: string;
  teacherId?: string;
  quizId?: string;
  startDate?: string;
  endDate?: string;
}

export interface StudentAssignmentProgress {
  id: string;
  studentId: string;
  student?: Student; // Populated field
  assignmentId: string;
  assignment?: Assignment; // Populated field
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  score?: number;
  maxScore?: number;
  attempts: number;
  maxAttempts: number;
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  lastActivityAt?: string;
  timeSpent: number; // in minutes
}

export type AssignmentStatus = 'all' | 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';

// ============= QUIZ TEMPLATE TYPES =============
export interface QuizTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // in minutes
  questionCount: number;
  departmentId: string;
  department?: Department;
  teacherId: string;
  teacher?: User;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizTemplateRequest {
  name: string;
  description?: string;
  category: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  departmentId: string;
  isPublic: boolean;
  tags: string[];
}

export interface QuizTemplateFilters {
  category?: string;
  difficulty?: DifficultyLevel;
  departmentId?: string;
  teacherId?: string;
  isPublic?: boolean;
  tags?: string[];
}

// ============= QUIZ VALIDATION TYPES =============
export interface QuizValidationResult {
  isValid: boolean;
  errors: QuizValidationError[];
  warnings: QuizValidationWarning[];
  suggestions: QuizValidationSuggestion[];
}

export interface QuizValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface QuizValidationWarning {
  field: string;
  message: string;
  type: 'content' | 'structure' | 'accessibility';
}

export interface QuizValidationSuggestion {
  field: string;
  message: string;
  action: string;
}

// ============= BULK OPERATIONS TYPES =============
export interface BulkOperationRequest<T> {
  operation: 'create' | 'update' | 'delete' | 'duplicate' | 'archive';
  items: T[];
  options?: BulkOperationOptions;
}

export interface BulkOperationOptions {
  ignoreErrors?: boolean;
  validateBefore?: boolean;
  batchSize?: number;
  notifyProgress?: boolean;
}

export interface BulkOperationResult<T> {
  success: boolean;
  processedCount: number;
  errorCount: number;
  results: BulkOperationItemResult<T>[];
  errors: BulkOperationError[];
}

export interface BulkOperationItemResult<T> {
  item: T;
  success: boolean;
  error?: string;
  result?: T;
}

export interface BulkOperationError {
  index: number;
  error: string;
  severity: 'error' | 'warning';
}

// ============= QUIZ ASSIGNMENT INTEGRATION TYPES =============
export interface QuizAssignment {
  id: string;
  quizId: string;
  quiz?: Quiz;
  assignmentId: string;
  assignment?: Assignment;
  studentIds: string[];
  students?: Student[];
  assignedAt: string;
  dueDate?: string;
  settings: QuizAssignmentSettings;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
}

export interface QuizAssignmentSettings {
  allowRetake: boolean;
  maxAttempts: number;
  timeLimit?: number;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  showResults: 'immediately' | 'after-deadline' | 'never';
  showCorrectAnswers: boolean;
}

export interface AssignQuizRequest {
  quizId: string;
  studentIds: string[];
  dueDate?: string;
  settings: QuizAssignmentSettings;
  assignmentId?: string;
}

// ============= UTILITY TYPES =============
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = any> {
  data: T | null;
  loading: LoadingState;
  error: string | null;
}

export type SortOrder = 'asc' | 'desc';

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}
