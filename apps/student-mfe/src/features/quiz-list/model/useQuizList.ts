/**
 * Quiz List Feature Hook - Student MFE
 * 
 * Feature hook quản lý việc lấy và hiển thị danh sách quiz
 * Theo FSD: Features chứa business logic của một tính năng cụ thể
 */

import { useState, useEffect } from 'react';
import type { Quiz } from '../../../entities/quiz/model/types';
import { quizAPI } from '../../../shared/api';

interface UseQuizListState {
  quizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
}

interface UseQuizListActions {
  refetch: () => Promise<void>;
  filterByCategory: (category: string) => Promise<void>;
  clearFilter: () => Promise<void>;
}

type UseQuizListReturn = UseQuizListState & UseQuizListActions;

/**
 * Hook quản lý danh sách quiz
 * Cung cấp data, loading state, error handling và các actions
 */
export const useQuizList = (): UseQuizListReturn => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load danh sách quiz từ API
   */
  const loadQuizzes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await quizAPI.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quizzes';
      setError(errorMessage);
      console.error('Error loading quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Lọc quiz theo category
   */
  const filterByCategory = async (category: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await quizAPI.getQuizzesByCategory(category);
      setQuizzes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to filter quizzes';
      setError(errorMessage);
      console.error('Error filtering quizzes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Xóa filter và load lại tất cả quiz
   */
  const clearFilter = async () => {
    await loadQuizzes();
  };

  /**
   * Refetch danh sách quiz
   */
  const refetch = async () => {
    await loadQuizzes();
  };

  // Load data khi component mount
  useEffect(() => {
    loadQuizzes();
  }, []); // Empty dependency array - chỉ chạy 1 lần

  return {
    // State
    quizzes,
    isLoading,
    error,
    // Actions
    refetch,
    filterByCategory,
    clearFilter
  };
};
