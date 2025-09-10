// ========================================================================
// FILE: src/api/services/gradingService.ts
// PURPOSE: Grading and assessment API service methods for teachers
// DESCRIPTION: All grading-related API operations for teacher functionality
// ========================================================================

import { httpClient } from '../httpClient';
import { ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../../types';

// ============= GRADING INTERFACES =============
export interface QuizAttempt {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number; // in seconds
  status: 'completed' | 'in_progress' | 'abandoned';
  submittedAt: string;
  gradedAt?: string;
  needsGrading: boolean;
  answers: Array<{
    questionId: string;
    questionText: string;
    questionType: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
    studentAnswer: any;
    correctAnswer?: any;
    points: number;
    maxPoints: number;
    feedback?: string;
    autoGraded: boolean;
  }>;
}

export interface GradingOverview {
  pendingGrading: number;
  totalAttempts: number;
  averageScore: number;
  gradingProgress: number; // percentage
  recentSubmissions: Array<{
    id: string;
    studentName: string;
    quizTitle: string;
    submittedAt: string;
    needsGrading: boolean;
  }>;
}

export interface BulkGradingUpdate {
  attemptId: string;
  feedback?: string;
  adjustments?: Array<{
    questionId: string;
    points: number;
    feedback?: string;
  }>;
}

export class GradingService {
  // ============= GRADING OVERVIEW =============
  async getGradingOverview(): Promise<GradingOverview> {
    return httpClient.get<GradingOverview>(
      ENDPOINTS.GRADING.OVERVIEW
    );
  }

  // ============= PENDING ATTEMPTS =============
  async getPendingGradingAttempts(params?: {
    classId?: string;
    quizId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<QuizAttempt[]>> {
    return httpClient.get<ApiResponse<QuizAttempt[]>>(
      ENDPOINTS.GRADING.PENDING,
      params
    );
  }

  // ============= ATTEMPT DETAILS =============
  async getAttemptDetails(attemptId: string): Promise<QuizAttempt> {
    return httpClient.get<QuizAttempt>(
      ENDPOINTS.GRADING.ATTEMPT_DETAILS(attemptId)
    );
  }

  // ============= GRADE ATTEMPT =============
  async gradeAttempt(
    attemptId: string,
    data: {
      feedback?: string;
      adjustments?: Array<{
        questionId: string;
        points: number;
        feedback?: string;
      }>;
      finalScore?: number;
    }
  ): Promise<QuizAttempt> {
    return httpClient.put<QuizAttempt>(
      ENDPOINTS.GRADING.GRADE_ATTEMPT(attemptId),
      data
    );
  }

  // ============= BULK GRADING =============
  async bulkGradeAttempts(
    updates: BulkGradingUpdate[]
  ): Promise<{ updated: number; errors: Array<{ attemptId: string; error: string }> }> {
    return httpClient.post<{ 
      updated: number; 
      errors: Array<{ attemptId: string; error: string }> 
    }>(
      ENDPOINTS.GRADING.BULK_GRADE,
      { updates }
    );
  }

  // ============= QUIZ GRADING OVERVIEW =============
  async getQuizGradingOverview(quizId: string): Promise<{
    quizTitle: string;
    totalAttempts: number;
    graded: number;
    pending: number;
    averageScore: number;
    distribution: {
      excellent: number; // 90-100%
      good: number;      // 70-89%
      average: number;   // 50-69%
      poor: number;      // <50%
    };
    attempts: Array<{
      id: string;
      studentName: string;
      score: number;
      maxScore: number;
      percentage: number;
      status: 'completed' | 'in_progress' | 'abandoned';
      submittedAt: string;
      needsGrading: boolean;
    }>;
  }> {
    return httpClient.get<{
      quizTitle: string;
      totalAttempts: number;
      graded: number;
      pending: number;
      averageScore: number;
      distribution: {
        excellent: number;
        good: number;
        average: number;
        poor: number;
      };
      attempts: Array<{
        id: string;
        studentName: string;
        score: number;
        maxScore: number;
        percentage: number;
        status: 'completed' | 'in_progress' | 'abandoned';
        submittedAt: string;
        needsGrading: boolean;
      }>;
    }>(ENDPOINTS.GRADING.QUIZ_OVERVIEW(quizId));
  }

  // ============= CLASS GRADING SUMMARY =============
  async getClassGradingSummary(classId: string): Promise<{
    className: string;
    totalStudents: number;
    totalQuizzes: number;
    pendingGrading: number;
    averageClassScore: number;
    students: Array<{
      id: string;
      name: string;
      email: string;
      averageScore: number;
      completedQuizzes: number;
      pendingQuizzes: number;
      lastActivity: string;
    }>;
    quizzes: Array<{
      id: string;
      title: string;
      totalAttempts: number;
      graded: number;
      pending: number;
      averageScore: number;
    }>;
  }> {
    return httpClient.get<{
      className: string;
      totalStudents: number;
      totalQuizzes: number;
      pendingGrading: number;
      averageClassScore: number;
      students: Array<{
        id: string;
        name: string;
        email: string;
        averageScore: number;
        completedQuizzes: number;
        pendingQuizzes: number;
        lastActivity: string;
      }>;
      quizzes: Array<{
        id: string;
        title: string;
        totalAttempts: number;
        graded: number;
        pending: number;
        averageScore: number;
      }>;
    }>(ENDPOINTS.GRADING.CLASS_SUMMARY(classId));
  }

  // ============= EXPORT GRADES =============
  async exportGrades(params: {
    classId?: string;
    quizId?: string;
    format: 'csv' | 'xlsx' | 'pdf';
    includeDetails?: boolean;
  }): Promise<Blob> {
    return httpClient.post<Blob>(
      ENDPOINTS.GRADING.EXPORT,
      params,
      { responseType: 'blob' }
    );
  }

  // ============= GRADE STATISTICS =============
  async getGradeStatistics(params: {
    classId?: string;
    quizId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalAttempts: number;
    averageScore: number;
    medianScore: number;
    highestScore: number;
    lowestScore: number;
    passRate: number; // percentage above 70%
    distribution: {
      ranges: Array<{
        min: number;
        max: number;
        count: number;
        percentage: number;
      }>;
    };
    trends: Array<{
      date: string;
      averageScore: number;
      attempts: number;
    }>;
  }> {
    return httpClient.get<{
      totalAttempts: number;
      averageScore: number;
      medianScore: number;
      highestScore: number;
      lowestScore: number;
      passRate: number;
      distribution: {
        ranges: Array<{
          min: number;
          max: number;
          count: number;
          percentage: number;
        }>;
      };
      trends: Array<{
        date: string;
        averageScore: number;
        attempts: number;
      }>;
    }>(ENDPOINTS.GRADING.STATISTICS, params);
  }
}

// Singleton instance
export const gradingService = new GradingService();
export default gradingService;
