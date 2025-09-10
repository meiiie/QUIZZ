// ========================================================================
// FILE: src/api/services/assignmentService.ts
// PURPOSE: Assignment management API service methods
// DESCRIPTION: All assignment-related API operations for quiz assignments
// ========================================================================

import { httpClient } from '../httpClient';
import { ENDPOINTS } from '../endpoints';
import {
  ApiResponse,
  PaginationParams,
} from '../../types';

// ============= ASSIGNMENT TYPES =============
export interface Assignment {
  id: string;
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
  assignToAll: boolean;
  assignToFutureStudents: boolean;
  
  // Department & Teacher
  departmentId: string;
  teacherId: string;
  
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
  status?: string;
  departmentId?: string;
  teacherId?: string;
  quizId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AssignmentStats {
  totalAssignments: number;
  activeAssignments: number;
  completedAssignments: number;
  draftAssignments: number;
  averageCompletionRate: number;
}

export interface StudentAssignmentProgress {
  studentId: string;
  studentName: string;
  assignmentId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  score?: number;
  attempts: number;
  lastAttemptAt?: string;
  completedAt?: string;
  timeSpent: number; // in minutes
}

// ============= ASSIGNMENT SERVICE CLASS =============
export class AssignmentService {
  // ============= ASSIGNMENT CRUD OPERATIONS =============
  async getAssignments(
    params?: PaginationParams & AssignmentFilters
  ): Promise<ApiResponse<Assignment[]>> {
    return httpClient.get<ApiResponse<Assignment[]>>(
      ENDPOINTS.ASSIGNMENTS.LIST,
      params
    );
  }

  async getAssignmentById(id: string): Promise<Assignment> {
    return httpClient.get<Assignment>(
      ENDPOINTS.ASSIGNMENTS.GET_BY_ID(id)
    );
  }

  async createAssignment(assignmentData: CreateAssignmentRequest): Promise<Assignment> {
    return httpClient.post<Assignment>(
      ENDPOINTS.ASSIGNMENTS.CREATE,
      assignmentData
    );
  }

  async updateAssignment(id: string, assignmentData: UpdateAssignmentRequest): Promise<Assignment> {
    return httpClient.put<Assignment>(
      ENDPOINTS.ASSIGNMENTS.UPDATE(id),
      assignmentData
    );
  }

  async deleteAssignment(id: string): Promise<void> {
    return httpClient.delete<void>(
      ENDPOINTS.ASSIGNMENTS.DELETE(id)
    );
  }

  // ============= ASSIGNMENT STATUS MANAGEMENT =============
  async publishAssignment(id: string): Promise<Assignment> {
    return httpClient.post<Assignment>(
      ENDPOINTS.ASSIGNMENTS.PUBLISH(id)
    );
  }

  async scheduleAssignment(id: string, scheduleData: {
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string;
  }): Promise<Assignment> {
    return httpClient.post<Assignment>(
      ENDPOINTS.ASSIGNMENTS.SCHEDULE(id),
      scheduleData
    );
  }

  async archiveAssignment(id: string): Promise<Assignment> {
    return httpClient.post<Assignment>(
      ENDPOINTS.ASSIGNMENTS.ARCHIVE(id)
    );
  }

  async duplicateAssignment(id: string, newName?: string): Promise<Assignment> {
    return httpClient.post<Assignment>(
      ENDPOINTS.ASSIGNMENTS.DUPLICATE(id),
      { newName }
    );
  }

  // ============= STUDENT ASSIGNMENT MANAGEMENT =============
  async addStudentsToAssignment(assignmentId: string, studentIds: string[]): Promise<void> {
    return httpClient.post<void>(
      ENDPOINTS.ASSIGNMENTS.ADD_STUDENTS(assignmentId),
      { studentIds }
    );
  }

  async removeStudentsFromAssignment(assignmentId: string, studentIds: string[]): Promise<void> {
    return httpClient.post<void>(
      ENDPOINTS.ASSIGNMENTS.REMOVE_STUDENTS(assignmentId),
      { studentIds }
    );
  }

  async getAssignmentStudents(assignmentId: string): Promise<StudentAssignmentProgress[]> {
    return httpClient.get<StudentAssignmentProgress[]>(
      ENDPOINTS.ASSIGNMENTS.STUDENTS(assignmentId)
    );
  }

  // ============= ASSIGNMENT ANALYTICS =============
  async getAssignmentStats(filters?: AssignmentFilters): Promise<AssignmentStats> {
    return httpClient.get<AssignmentStats>(
      ENDPOINTS.ASSIGNMENTS.STATS,
      filters
    );
  }

  async getAssignmentProgress(assignmentId: string): Promise<{
    totalStudents: number;
    completedStudents: number;
    inProgressStudents: number;
    notStartedStudents: number;
    averageScore: number;
    averageTime: number;
  }> {
    return httpClient.get(
      ENDPOINTS.ASSIGNMENTS.PROGRESS(assignmentId)
    );
  }

  // ============= BULK OPERATIONS =============
  async bulkUpdateAssignments(assignmentIds: string[], updates: Partial<Assignment>): Promise<Assignment[]> {
    return httpClient.post<Assignment[]>(
      ENDPOINTS.ASSIGNMENTS.BULK_UPDATE,
      { assignmentIds, updates }
    );
  }

  async bulkDeleteAssignments(assignmentIds: string[]): Promise<void> {
    return httpClient.post<void>(
      ENDPOINTS.ASSIGNMENTS.BULK_DELETE,
      { assignmentIds }
    );
  }

  // ============= ASSIGNMENT TEMPLATES =============
  async getAssignmentTemplates(): Promise<Assignment[]> {
    return httpClient.get<Assignment[]>(
      ENDPOINTS.ASSIGNMENTS.TEMPLATES
    );
  }

  async createAssignmentFromTemplate(templateId: string, customData?: Partial<CreateAssignmentRequest>): Promise<Assignment> {
    return httpClient.post<Assignment>(
      ENDPOINTS.ASSIGNMENTS.CREATE_FROM_TEMPLATE(templateId),
      customData
    );
  }

  // ============= ASSIGNMENT VALIDATION =============
  async validateAssignmentData(assignmentData: CreateAssignmentRequest): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    return httpClient.post(
      ENDPOINTS.ASSIGNMENTS.VALIDATE,
      assignmentData
    );
  }

  async checkAssignmentConflicts(assignmentData: CreateAssignmentRequest): Promise<{
    hasConflicts: boolean;
    conflicts: Array<{
      type: 'time' | 'student' | 'quiz';
      message: string;
      conflictingAssignmentId?: string;
    }>;
  }> {
    return httpClient.post(
      ENDPOINTS.ASSIGNMENTS.CHECK_CONFLICTS,
      assignmentData
    );
  }
}

// ============= SERVICE INSTANCE =============
export const assignmentService = new AssignmentService();
export default assignmentService;
