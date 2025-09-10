// ========================================================================
// FILE: src/api/services/departmentService.ts
// PURPOSE: Teacher-focused department management API service methods
// DESCRIPTION: Department operations for teacher view (read-only mostly)
// ========================================================================

import { httpClient } from '../httpClient';
import { ENDPOINTS } from '../endpoints';
import {
  Department,
  Student,
  ApiResponse,
  PaginationParams,
} from '../../types';

export class DepartmentService {
  // ============= DEPARTMENT VIEW OPERATIONS (TEACHER) =============
  async getDepartments(
    params?: PaginationParams
  ): Promise<ApiResponse<Department[]>> {
    return httpClient.get<ApiResponse<Department[]>>(
      ENDPOINTS.DEPARTMENTS.LIST,
      params
    );
  }

  async getAllDepartments(): Promise<Department[]> {
    const response = await httpClient.get<ApiResponse<Department[]>>(
      ENDPOINTS.DEPARTMENTS.LIST,
      { page: 1, limit: 1000 }
    );
    return response.data || [];
  }

  async getDepartmentById(id: string): Promise<Department> {
    return httpClient.get<Department>(
      ENDPOINTS.DEPARTMENTS.GET_BY_ID(id)
    );
  }

  // ============= MY DEPARTMENT (TEACHER) =============
  async getMyDepartment(): Promise<Department> {
    return httpClient.get<Department>(
      ENDPOINTS.DEPARTMENTS.MY_DEPARTMENT
    );
  }

  // ============= DEPARTMENT STUDENTS (TEACHER VIEW) =============
  async getDepartmentStudents(
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Student[]>> {
    return httpClient.get<ApiResponse<Student[]>>(
      ENDPOINTS.DEPARTMENTS.STUDENTS(id),
      params
    );
  }

  // ============= DEPARTMENT STATISTICS (TEACHER VIEW) =============
  async getDepartmentStatistics(id: string): Promise<{
    totalStudents: number;
    activeStudents: number;
    totalQuizzes: number;
    completedQuizzes: number;
    averageScore: number;
    averageProgress: number;
    recentActivities: Array<{
      id: string;
      type: 'quiz_completed' | 'student_enrolled' | 'quiz_created';
      description: string;
      timestamp: string;
      studentName?: string;
      quizTitle?: string;
    }>;
    progressDistribution: {
      excellent: number; // 90-100%
      good: number;      // 70-89%
      average: number;   // 50-69%
      needsImprovement: number; // <50%
    };
    monthlyStats: Array<{
      month: string;
      completedQuizzes: number;
      newStudents: number;
      averageScore: number;
    }>;
  }> {
    return httpClient.get<{
      totalStudents: number;
      activeStudents: number;
      totalQuizzes: number;
      completedQuizzes: number;
      averageScore: number;
      averageProgress: number;
      recentActivities: Array<{
        id: string;
        type: 'quiz_completed' | 'student_enrolled' | 'quiz_created';
        description: string;
        timestamp: string;
        studentName?: string;
        quizTitle?: string;
      }>;
      progressDistribution: {
        excellent: number;
        good: number;
        average: number;
        needsImprovement: number;
      };
      monthlyStats: Array<{
        month: string;
        completedQuizzes: number;
        newStudents: number;
        averageScore: number;
      }>;
    }>(ENDPOINTS.DEPARTMENTS.STATISTICS(id));
  }

  // ============= SEARCH & FILTER OPERATIONS =============
  async searchDepartments(query: string): Promise<Department[]> {
    const response = await httpClient.get<ApiResponse<Department[]>>(
      ENDPOINTS.DEPARTMENTS.LIST,
      {
        search: query,
        page: 1,
        limit: 20,
      }
    );
    return response.data || [];
  }
}

// Singleton instance
export const departmentService = new DepartmentService();
export default departmentService;