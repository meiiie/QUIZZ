/**
 * Quiz History REST API Client
 * 
 * HTTP client for quiz history endpoints
 * Professional error handling and type safety
 */

import type { QuizAttempt, QuizHistoryStats, QuizHistoryFilter } from '../../../entities/history/model/types';
import { httpClient } from './base';

/**
 * Fetch user's quiz completion history
 */
export const fetchQuizHistory = async (filter?: QuizHistoryFilter): Promise<QuizAttempt[]> => {
  try {
    console.log('🌐 API: Fetching quiz history...');
    
    // Build query parameters from filter
    const queryParams = new URLSearchParams();
    if (filter?.subject) queryParams.append('subject', filter.subject);
    if (filter?.dateFrom) queryParams.append('dateFrom', filter.dateFrom);
    if (filter?.dateTo) queryParams.append('dateTo', filter.dateTo);
    if (filter?.status) queryParams.append('status', filter.status);
    
    const url = `/api/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await httpClient.get<QuizAttempt[]>(url);
    
    console.log('✅ API: Quiz history fetched successfully:', response.data.length, 'records');
    return response.data;
    
  } catch (error) {
    console.error('❌ API: Failed to fetch quiz history:', error);
    throw new Error('Unable to load quiz history. Please try again.');
  }
};

/**
 * Fetch quiz history statistics
 */
export const fetchQuizHistoryStats = async (): Promise<QuizHistoryStats> => {
  try {
    console.log('🌐 API: Fetching quiz history stats...');
    
    const response = await httpClient.get<QuizHistoryStats>('/api/history/stats');
    
    console.log('✅ API: Quiz history stats fetched successfully');
    return response.data;
    
  } catch (error) {
    console.error('❌ API: Failed to fetch quiz history stats:', error);
    throw new Error('Unable to load quiz statistics. Please try again.');
  }
};

/**
 * Fetch specific quiz attempt details
 */
export const fetchQuizAttemptDetails = async (attemptId: string): Promise<QuizAttempt> => {
  try {
    console.log('🌐 API: Fetching quiz attempt details...', attemptId);
    
    const response = await httpClient.get<QuizAttempt>(`/api/history/${attemptId}`);
    
    console.log('✅ API: Quiz attempt details fetched successfully');
    return response.data;
    
  } catch (error) {
    console.error('❌ API: Failed to fetch quiz attempt details:', error);
    throw new Error('Unable to load quiz attempt details. Please try again.');
  }
};
