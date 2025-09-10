/**
 * Quiz History Feature Hook
 * 
 * Business logic for quiz history management
 * Following FSD feature layer principles
 */

import { useState, useEffect, useCallback } from 'react';
import type { QuizAttempt, QuizHistoryStats, QuizHistoryFilter } from '../../../entities/history/model/types';
import { historyAPI } from '../../../shared/api';

export const useQuizHistory = (filter?: QuizHistoryFilter) => {
  const [history, setHistory] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState<QuizHistoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Loading quiz history...');
      
      const [historyData, statsData] = await Promise.all([
        historyAPI.getHistory(filter),
        historyAPI.getStats()
      ]);
      
      setHistory(historyData);
      setStats(statsData);
      
      console.log('✅ Quiz history loaded:', historyData.length, 'records');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quiz history.';
      setError(errorMessage);
      console.error('❌ useQuizHistory: Error loading data:', err);
      
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  const refreshHistory = () => {
    loadHistory();
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    // Data
    history,
    stats,
    
    // State
    isLoading,
    error,
    
    // Actions
    refreshHistory,
    clearError,
    
    // Computed
    hasHistory: history.length > 0,
    isEmpty: !isLoading && history.length === 0
  };
};

/**
 * Hook for individual quiz attempt details
 */
export const useQuizAttemptDetails = (attemptId: string | null) => {
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) return;

    const loadAttemptDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const attemptData = await historyAPI.getAttemptDetails(attemptId);
        setAttempt(attemptData);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load attempt details.';
        setError(errorMessage);
        console.error('useQuizAttemptDetails: Error loading data:', err);
        
      } finally {
        setIsLoading(false);
      }
    };

    loadAttemptDetails();
  }, [attemptId]);

  return {
    attempt,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
