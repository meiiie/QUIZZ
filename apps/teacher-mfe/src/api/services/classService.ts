// ========================================================================
// FILE: src/api/services/classService.ts
// PURPOSE: Class management API service methods for teachers
// DESCRIPTION: All class-related API operations for teacher functionality
// ========================================================================

import { httpClient } from '../httpClient';
import { ENDPOINTS } from '../endpoints';
import {
  Student,
  Quiz,
  ApiResponse,
  PaginationParams,
} from '../../types';

// ============= CLASS INTERFACE =============
export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacherId: string;
  departmentId: string;
  semester: string;
  academicYear: string;
  totalStudents: number;
  activeStudents: number;
  createdAt: string;
  updatedAt: string;
}

export class ClassService {
  // ============= MY CLASSES OPERATIONS =============
  async getMyClasses(params?: PaginationParams): Promise<ApiResponse<Class[]>> {
    return httpClient.get<ApiResponse<Class[]>>(
      ENDPOINTS.CLASSES.MY_CLASSES,
      params
    );
  }

  async getClassById(id: string): Promise<Class> {
    return httpClient.get<Class>(
      ENDPOINTS.CLASSES.GET_CLASS(id)
    );
  }

  // ============= CLASS STUDENTS =============
  async getClassStudents(
    classId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Student[]>> {
    return httpClient.get<ApiResponse<Student[]>>(
      ENDPOINTS.CLASSES.CLASS_STUDENTS(classId),
      params
    );
  }

  // ============= CLASS QUIZZES =============
  async getClassQuizzes(
    classId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Quiz[]>> {
    return httpClient.get<ApiResponse<Quiz[]>>(
      ENDPOINTS.CLASSES.CLASS_QUIZZES(classId),
      params
    );
  }

  // ============= CLASS STATISTICS =============
  async getClassStatistics(classId: string): Promise<{
    totalStudents: number;
    activeStudents: number;
    totalQuizzes: number;
    completedQuizzes: number;
    averageScore: number;
    passRate: number;
    attendanceRate: number;
    progressDistribution: {
      excellent: number; // 90-100%
      good: number;      // 70-89%
      average: number;   // 50-69%
      needsImprovement: number; // <50%
    };
    recentActivities: Array<{
      id: string;
      type: 'quiz_completed' | 'student_enrolled' | 'quiz_created';
      description: string;
      timestamp: string;
      studentName?: string;
      quizTitle?: string;
    }>;
    topPerformers: Array<{
      studentId: string;
      studentName: string;
      averageScore: number;
      completedQuizzes: number;
    }>;
    strugglingStudents: Array<{
      studentId: string;
      studentName: string;
      averageScore: number;
      missedQuizzes: number;
    }>;
  }> {
    return httpClient.get<{
      totalStudents: number;
      activeStudents: number;
      totalQuizzes: number;
      completedQuizzes: number;
      averageScore: number;
      passRate: number;
      attendanceRate: number;
      progressDistribution: {
        excellent: number;
        good: number;
        average: number;
        needsImprovement: number;
      };
      recentActivities: Array<{
        id: string;
        type: 'quiz_completed' | 'student_enrolled' | 'quiz_created';
        description: string;
        timestamp: string;
        studentName?: string;
        quizTitle?: string;
      }>;
      topPerformers: Array<{
        studentId: string;
        studentName: string;
        averageScore: number;
        completedQuizzes: number;
      }>;
      strugglingStudents: Array<{
        studentId: string;
        studentName: string;
        averageScore: number;
        missedQuizzes: number;
      }>;
    }>(ENDPOINTS.CLASSES.CLASS_STATISTICS(classId));
  }

  // ============= CLASS OVERVIEW =============
  async getClassOverview(): Promise<Array<{
    classId: string;
    className: string;
    totalStudents: number;
    activeQuizzes: number;
    averageScore: number;
    lastActivity: string;
    needsAttention: boolean;
  }>> {
    const response = await httpClient.get<ApiResponse<Class[]>>(
      ENDPOINTS.CLASSES.MY_CLASSES,
      { page: 1, limit: 100 }
    );

    // Transform to overview format
    return (response.data || []).map(cls => ({
      classId: cls.id,
      className: cls.name,
      totalStudents: cls.totalStudents,
      activeQuizzes: 0, // Will be populated by API
      averageScore: 0,  // Will be populated by API
      lastActivity: cls.updatedAt,
      needsAttention: cls.activeStudents < cls.totalStudents * 0.8
    }));
  }
}

// Singleton instance
export const classService = new ClassService();
export default classService;
