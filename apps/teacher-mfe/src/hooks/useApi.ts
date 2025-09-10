// ========================================================================
// FILE: src/hooks/useApi.ts
// PURPOSE: Custom React hooks for API integration
// DESCRIPTION: Reusable hooks for API calls with loading states
// ========================================================================

import { useState, useEffect, useCallback } from 'react';
import { apiServices } from '../api';
import { LoadingState, ApiError } from '../types';

// ============= GENERIC API HOOK =============
export function useApiCall<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading('loading');
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
      setLoading('success');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'An error occurred';
      setError(message);
      setLoading('error');
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

// ============= STUDENT HOOKS =============
export function useStudents(params?: any) {
  return useApiCall(
    () => apiServices.students.getStudents(params),
    [params]
  );
}

export function useStudent(id: string) {
  return useApiCall(
    () => apiServices.students.getStudentById(id),
    [id]
  );
}

export function useStudentProgress(id: string) {
  return useApiCall(
    () => apiServices.students.getStudentProgress(id),
    [id]
  );
}

// ============= QUIZ HOOKS =============
export function useQuizzes(params?: any) {
  return useApiCall(
    () => apiServices.quizzes.getQuizzes(params),
    [params]
  );
}

export function useQuiz(id: string) {
  return useApiCall(
    () => apiServices.quizzes.getQuizById(id),
    [id]
  );
}

export function useQuizStatistics(id: string) {
  return useApiCall(
    () => apiServices.quizzes.getQuizStatistics(id),
    [id]
  );
}

// ============= DEPARTMENT HOOKS =============
export function useDepartments() {
  return useApiCall(
    () => apiServices.departments.getAllDepartments(),
    []
  );
}

export function useDepartment(id: string) {
  return useApiCall(
    () => apiServices.departments.getDepartmentById(id),
    [id]
  );
}

export function useDepartmentStatistics(id: string) {
  return useApiCall(
    () => apiServices.departments.getDepartmentStatistics(id),
    [id]
  );
}

// ============= ANALYTICS HOOKS =============
export function useDashboardStats() {
  return useApiCall(
    () => apiServices.analytics.getTeacherDashboard(),
    []
  );
}

export function useDepartmentStats(filters?: any) {
  return useApiCall(
    () => apiServices.analytics.getMyClassesStats(),
    [filters]
  );
}

export function useStudentProgressStats(filters?: any) {
  return useApiCall(
    () => apiServices.analytics.getStudentProgress(filters),
    [filters]
  );
}

export function useQuizPerformanceStats(filters?: any) {
  return useApiCall(
    () => apiServices.analytics.getQuizPerformance(filters),
    [filters]
  );
}

// ============= MUTATION HOOKS =============
export function useApiMutation<T, P = any>(
  mutationFn: (params: P) => Promise<T>
) {
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    setLoading('loading');
    setError(null);
    
    try {
      const result = await mutationFn(params);
      setLoading('success');
      return result;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'An error occurred';
      setError(message);
      setLoading('error');
      return null;
    }
  }, [mutationFn]);

  return { mutate, loading, error };
}

// ============= SPECIFIC MUTATION HOOKS =============
export function useCreateStudent() {
  return useApiMutation((data: any) => 
    apiServices.students.updateStudent('new', data) // Teachers can't create students directly
  );
}

export function useUpdateStudent() {
  return useApiMutation(({ id, data }: { id: string; data: any }) =>
    apiServices.students.updateStudent(id, data)
  );
}

export function useDeleteStudent() {
  return useApiMutation((_id: string) =>
    Promise.reject(new Error('Teachers cannot delete students'))
  );
}

export function useCreateQuiz() {
  return useApiMutation(apiServices.quizzes.createQuiz);
}

export function useUpdateQuiz() {
  return useApiMutation(({ id, data }: { id: string; data: any }) =>
    apiServices.quizzes.updateQuiz(id, data)
  );
}

export function useDeleteQuiz() {
  return useApiMutation((id: string) =>
    apiServices.quizzes.deleteQuiz(id)
  );
}

// ============= EXPORT ALL HOOKS =============
export const apiHooks = {
  // Generic
  useApiCall,
  useApiMutation,
  
  // Students
  useStudents,
  useStudent,
  useStudentProgress,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  
  // Quizzes
  useQuizzes,
  useQuiz,
  useQuizStatistics,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
  
  // Departments
  useDepartments,
  useDepartment,
  useDepartmentStatistics,
  
  // Analytics
  useDashboardStats,
  useDepartmentStats,
  useStudentProgressStats,
  useQuizPerformanceStats,
} as const;
