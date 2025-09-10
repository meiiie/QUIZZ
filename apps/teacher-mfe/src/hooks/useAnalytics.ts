// ========================================================================
// FILE: src/hooks/useAnalytics.ts
// PURPOSE: Analytics data hook for teacher dashboard
// DESCRIPTION: Custom hook to manage analytics data and dashboard statistics
// ========================================================================

import { useState, useCallback, useEffect } from 'react';
import { analyticsService, type TeacherDashboardStats, type ClassAnalytics } from '../api/services';

interface AnalyticsState {
  dashboard: TeacherDashboardStats | null;
  classAnalytics: ClassAnalytics[];
  loading: boolean;
  error: string | null;
}

export const useAnalytics = () => {
  const [analyticsState, setAnalyticsState] = useState<AnalyticsState>({
    dashboard: null,
    classAnalytics: [],
    loading: false,
    error: null,
  });

  const fetchDashboardStats = useCallback(async () => {
    try {
      setAnalyticsState(prev => ({ ...prev, loading: true, error: null }));
      
      const dashboard = await analyticsService.getTeacherDashboard();
      
      setAnalyticsState(prev => ({
        ...prev,
        dashboard,
        loading: false,
      }));
    } catch (error: any) {
      setAnalyticsState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch dashboard stats',
      }));
    }
  }, []);

  const fetchClassAnalytics = useCallback(async () => {
    try {
      setAnalyticsState(prev => ({ ...prev, loading: true, error: null }));
      
      const classAnalytics = await analyticsService.getMyClassesStats();
      
      setAnalyticsState(prev => ({
        ...prev,
        classAnalytics,
        loading: false,
      }));
    } catch (error: any) {
      setAnalyticsState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch class analytics',
      }));
    }
  }, []);

  const fetchStudentProgress = useCallback(async (params?: {
    classId?: string;
    studentId?: string;
    timeRange?: 'week' | 'month' | 'semester';
  }) => {
    try {
      return await analyticsService.getStudentProgress(params);
    } catch (error: any) {
      setAnalyticsState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch student progress',
      }));
      throw error;
    }
  }, []);

  const fetchQuizPerformance = useCallback(async (params?: {
    quizId?: string;
    classId?: string;
    timeRange?: 'week' | 'month' | 'semester';
  }) => {
    try {
      return await analyticsService.getQuizPerformance(params);
    } catch (error: any) {
      setAnalyticsState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch quiz performance',
      }));
      throw error;
    }
  }, []);

  const exportReport = useCallback(async (params: {
    reportType: 'class_summary' | 'student_progress' | 'quiz_analysis';
    classId?: string;
    format: 'pdf' | 'csv' | 'xlsx';
    dateRange?: {
      start: string;
      end: string;
    };
  }) => {
    try {
      const blob = await analyticsService.exportReport(params);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${params.reportType}_report.${params.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error: any) {
      setAnalyticsState(prev => ({
        ...prev,
        error: error.message || 'Failed to export report',
      }));
      throw error;
    }
  }, []);

  const exportGrades = useCallback(async (params: {
    classId?: string;
    format: 'csv' | 'xlsx';
    includeComments?: boolean;
  }) => {
    try {
      const blob = await analyticsService.exportGrades(params);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `grades_export.${params.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error: any) {
      setAnalyticsState(prev => ({
        ...prev,
        error: error.message || 'Failed to export grades',
      }));
      throw error;
    }
  }, []);

  const fetchRecentActivities = useCallback(async (limit: number = 20) => {
    try {
      return await analyticsService.getRecentActivities(limit);
    } catch (error: any) {
      setAnalyticsState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch recent activities',
      }));
      throw error;
    }
  }, []);

  const fetchTimeBasedAnalytics = useCallback(async (params: {
    timeRange: 'daily' | 'weekly' | 'monthly';
    startDate: string;
    endDate: string;
    classId?: string;
  }) => {
    try {
      return await analyticsService.getTimeBasedAnalytics(params);
    } catch (error: any) {
      setAnalyticsState(prev => ({
        ...prev,
        error: error.message || 'Failed to fetch time-based analytics',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setAnalyticsState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-fetch dashboard stats on mount
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return {
    ...analyticsState,
    fetchDashboardStats,
    fetchClassAnalytics,
    fetchStudentProgress,
    fetchQuizPerformance,
    fetchRecentActivities,
    fetchTimeBasedAnalytics,
    exportReport,
    exportGrades,
    clearError,
  };
};
