// ========================================================================
// FILE: src/hooks/useQuizzes.ts
// PURPOSE: Quiz management hook for teachers
// DESCRIPTION: Custom hook to manage quiz operations and state
// ========================================================================

import { useState, useCallback } from 'react';
import { quizService } from '../api/services';
import { Quiz, PaginationParams } from '../types';

interface QuizState {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export const useQuizzes = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    quizzes: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      totalPages: 0,
    },
  });

  const fetchQuizzes = useCallback(async (params?: PaginationParams) => {
    try {
      setQuizState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await quizService.getQuizzes(params);
      
      setQuizState(prev => ({
        ...prev,
        quizzes: response.data || [],
        loading: false,
        pagination: {
          total: response.pagination?.total || 0,
          page: response.pagination?.page || 1,
          totalPages: response.pagination?.totalPages || 0,
        },
      }));
    } catch (error: any) {
      setQuizState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch quizzes',
      }));
    }
  }, []);

  const createQuiz = useCallback(async (quizData: any) => {
    try {
      setQuizState(prev => ({ ...prev, loading: true, error: null }));
      
      const newQuiz = await quizService.createQuiz(quizData);
      
      setQuizState(prev => ({
        ...prev,
        quizzes: [newQuiz, ...prev.quizzes],
        loading: false,
      }));
      
      return newQuiz;
    } catch (error: any) {
      setQuizState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to create quiz',
      }));
      throw error;
    }
  }, []);

  const updateQuiz = useCallback(async (id: string, quizData: any) => {
    try {
      setQuizState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedQuiz = await quizService.updateQuiz(id, quizData);
      
      setQuizState(prev => ({
        ...prev,
        quizzes: prev.quizzes.map(quiz => 
          quiz.id === id ? updatedQuiz : quiz
        ),
        loading: false,
      }));
      
      return updatedQuiz;
    } catch (error: any) {
      setQuizState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to update quiz',
      }));
      throw error;
    }
  }, []);

  const deleteQuiz = useCallback(async (id: string) => {
    try {
      setQuizState(prev => ({ ...prev, loading: true, error: null }));
      
      await quizService.deleteQuiz(id);
      
      setQuizState(prev => ({
        ...prev,
        quizzes: prev.quizzes.filter(quiz => quiz.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      setQuizState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to delete quiz',
      }));
      throw error;
    }
  }, []);

  const publishQuiz = useCallback(async (id: string) => {
    try {
      const updatedQuiz = await quizService.publishQuiz(id);
      
      setQuizState(prev => ({
        ...prev,
        quizzes: prev.quizzes.map(quiz => 
          quiz.id === id ? updatedQuiz : quiz
        ),
      }));
      
      return updatedQuiz;
    } catch (error: any) {
      setQuizState(prev => ({
        ...prev,
        error: error.message || 'Failed to publish quiz',
      }));
      throw error;
    }
  }, []);

  const unpublishQuiz = useCallback(async (id: string) => {
    try {
      // Assuming unpublish is just updating status to draft
      const updatedQuiz = await quizService.updateQuiz(id, { status: 'draft' });
      
      setQuizState(prev => ({
        ...prev,
        quizzes: prev.quizzes.map(quiz => 
          quiz.id === id ? updatedQuiz : quiz
        ),
      }));
      
      return updatedQuiz;
    } catch (error: any) {
      setQuizState(prev => ({
        ...prev,
        error: error.message || 'Failed to unpublish quiz',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setQuizState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...quizState,
    fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    unpublishQuiz,
    clearError,
  };
};
