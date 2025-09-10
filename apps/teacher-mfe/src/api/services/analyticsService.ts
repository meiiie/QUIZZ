// ========================================================================
// FILE: src/api/services/analyticsService.ts
// PURPOSE: Analytics and reporting API service methods for teachers
// DESCRIPTION: All analytics-related API operations for teacher dashboard and reporting
// ========================================================================

import { httpClient } from '../httpClient';
import { ENDPOINTS } from '../endpoints';

// ============= ANALYTICS INTERFACES =============
export interface TeacherDashboardStats {
  overview: {
    totalClasses: number;
    totalStudents: number;
    totalQuizzes: number;
    pendingGrading: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'quiz_submitted' | 'student_enrolled' | 'quiz_created';
    description: string;
    timestamp: string;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    dueDate: string;
    type: 'quiz' | 'assignment';
    className: string;
  }>;
  performanceMetrics: {
    averageClassScore: number;
    studentEngagement: number; // percentage
    quizCompletionRate: number; // percentage
    gradingBacklog: number;
  };
}

export interface ClassAnalytics {
  classId: string;
  className: string;
  totalStudents: number;
  activeStudents: number;
  averageScore: number;
  performanceTrend: 'improving' | 'declining' | 'stable';
  topPerformers: Array<{
    studentId: string;
    name: string;
    score: number;
  }>;
  strugglingStudents: Array<{
    studentId: string;
    name: string;
    score: number;
  }>;
  quizStatistics: {
    total: number;
    completed: number;
    averageScore: number;
    passRate: number;
  };
}

export class AnalyticsService {
  // ============= TEACHER DASHBOARD ANALYTICS =============
  async getTeacherDashboard(): Promise<TeacherDashboardStats> {
    return httpClient.get<TeacherDashboardStats>(
      ENDPOINTS.ANALYTICS.TEACHER_DASHBOARD
    );
  }

  // ============= CLASS ANALYTICS =============
  async getMyClassesStats(): Promise<ClassAnalytics[]> {
    return httpClient.get<ClassAnalytics[]>(
      ENDPOINTS.ANALYTICS.MY_CLASSES_STATS
    );
  }

  async getClassAnalytics(classId: string): Promise<ClassAnalytics> {
    return httpClient.get<ClassAnalytics>(
      `${ENDPOINTS.ANALYTICS.MY_CLASSES_STATS}/${classId}`
    );
  }

  // ============= STUDENT PROGRESS ANALYTICS =============
  async getStudentProgress(params?: {
    classId?: string;
    studentId?: string;
    timeRange?: 'week' | 'month' | 'semester';
  }): Promise<Array<{
    studentId: string;
    studentName: string;
    overallScore: number;
    trend: 'improving' | 'declining' | 'stable';
    completedQuizzes: number;
    totalQuizzes: number;
    lastActivity: string;
  }>> {
    return httpClient.get<Array<{
      studentId: string;
      studentName: string;
      overallScore: number;
      trend: 'improving' | 'declining' | 'stable';
      completedQuizzes: number;
      totalQuizzes: number;
      lastActivity: string;
    }>>(
      ENDPOINTS.ANALYTICS.STUDENT_PROGRESS,
      params
    );
  }

  // ============= QUIZ PERFORMANCE ANALYTICS =============
  async getQuizPerformance(params?: {
    quizId?: string;
    classId?: string;
    timeRange?: 'week' | 'month' | 'semester';
  }): Promise<{
    averageScore: number;
    medianScore: number;
    completionRate: number;
    timeSpentAverage: number; // in minutes
    difficultyAnalysis: {
      easy: number; // percentage of students who scored >80%
      medium: number; // percentage of students who scored 60-80%
      hard: number; // percentage of students who scored <60%
    };
    questionAnalysis: Array<{
      questionId: string;
      correctAnswers: number;
      totalAttempts: number;
      difficultyLevel: 'easy' | 'medium' | 'hard';
    }>;
  }> {
    return httpClient.get<{
      averageScore: number;
      medianScore: number;
      completionRate: number;
      timeSpentAverage: number;
      difficultyAnalysis: {
        easy: number;
        medium: number;
        hard: number;
      };
      questionAnalysis: Array<{
        questionId: string;
        correctAnswers: number;
        totalAttempts: number;
        difficultyLevel: 'easy' | 'medium' | 'hard';
      }>;
    }>(
      ENDPOINTS.ANALYTICS.QUIZ_PERFORMANCE,
      params
    );
  }

  // ============= RECENT ACTIVITIES =============
  async getRecentActivities(limit: number = 20): Promise<Array<{
    id: string;
    type: 'quiz_submitted' | 'student_enrolled' | 'quiz_created' | 'grade_updated';
    description: string;
    timestamp: string;
    relatedId?: string;
    className?: string;
    studentName?: string;
  }>> {
    return httpClient.get<Array<{
      id: string;
      type: 'quiz_submitted' | 'student_enrolled' | 'quiz_created' | 'grade_updated';
      description: string;
      timestamp: string;
      relatedId?: string;
      className?: string;
      studentName?: string;
    }>>(
      ENDPOINTS.ANALYTICS.RECENT_ACTIVITIES,
      { limit }
    );
  }

  // ============= EXPORT REPORTS =============
  async exportReport(params: {
    reportType: 'class_summary' | 'student_progress' | 'quiz_analysis';
    classId?: string;
    format: 'pdf' | 'csv' | 'xlsx';
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<Blob> {
    return httpClient.post<Blob>(
      ENDPOINTS.ANALYTICS.EXPORT_REPORT,
      params,
      { responseType: 'blob' }
    );
  }

  async exportGrades(params: {
    classId?: string;
    format: 'csv' | 'xlsx';
    includeComments?: boolean;
  }): Promise<Blob> {
    return httpClient.post<Blob>(
      ENDPOINTS.ANALYTICS.EXPORT_GRADES,
      params,
      { responseType: 'blob' }
    );
  }

  // ============= TIME-BASED ANALYTICS =============
  async getTimeBasedAnalytics(params: {
    timeRange: 'daily' | 'weekly' | 'monthly';
    startDate: string;
    endDate: string;
    classId?: string;
  }): Promise<{
    timeline: Array<{
      date: string;
      quizSubmissions: number;
      averageScore: number;
      activeStudents: number;
    }>;
    trends: {
      engagementTrend: 'up' | 'down' | 'stable';
      performanceTrend: 'up' | 'down' | 'stable';
      participationTrend: 'up' | 'down' | 'stable';
    };
  }> {
    return httpClient.get<{
      timeline: Array<{
        date: string;
        quizSubmissions: number;
        averageScore: number;
        activeStudents: number;
      }>;
      trends: {
        engagementTrend: 'up' | 'down' | 'stable';
        performanceTrend: 'up' | 'down' | 'stable';
        participationTrend: 'up' | 'down' | 'stable';
      };
    }>(
      `${ENDPOINTS.ANALYTICS.TEACHER_DASHBOARD}/time-series`,
      params
    );
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;
