/**
 * Quiz API Client - Student MFE
 * 
 * Consolidated quiz-related API calls using base HTTP client
 * Implements domain-specific business logic and error handling
 */

import { api } from './base';
import type { 
  Quiz, 
  Question, 
  QuizAnswer, 
  QuizAttempt 
} from '../../../entities/quiz/model/types';

/**
 * Quiz API endpoints
 */
export const QUIZ_ENDPOINTS = {
  quizzes: 'quizzes',
  quiz: (id: string) => `quizzes/${id}`,
  category: (category: string) => `quizzes/category/${category}`,
  questions: (quizId: string) => `quizzes/${quizId}/questions`,
  attempts: 'quiz-attempts',
  submitAttempt: (attemptId: string) => `quiz-attempts/${attemptId}/submit`,
  test: 'test'
} as const;

/**
 * Quiz API Service Class
 */
export class QuizApiService {
  /**
   * Test API connectivity
   */
  async testConnection(): Promise<{ message: string; timestamp: string; service?: string }> {
    try {
      const response = await api.get<{ message: string; timestamp: string; service?: string }>(
        QUIZ_ENDPOINTS.test
      );
      return response.data;
    } catch (error) {
      console.error('❌ Quiz API: Test connection failed', error);
      throw new Error('Failed to connect to quiz service');
    }
  }

  /**
   * Fetch all available quizzes
   */
  async getQuizzes(): Promise<Quiz[]> {
    try {
      const response = await api.get<Quiz[]>(QUIZ_ENDPOINTS.quizzes);
      
      // Validate response structure
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response: Expected array of quizzes');
      }

      console.log('✅ Quiz API: Fetched', response.data.length, 'quizzes');
      return response.data;
    } catch (error) {
      console.error('❌ Quiz API: Failed to fetch quizzes', error);
      throw new Error('Unable to load quizzes. Please try again.');
    }
  }

  /**
   * Fetch quiz by ID
   */
  async getQuizById(id: string): Promise<Quiz> {
    if (!id || id.trim() === '') {
      throw new Error('Quiz ID is required');
    }

    try {
      const response = await api.get<Quiz>(QUIZ_ENDPOINTS.quiz(id));
      
      // Validate response structure
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response: Expected quiz object');
      }

      console.log('✅ Quiz API: Fetched quiz:', response.data.title);
      return response.data;
    } catch (error) {
      console.error('❌ Quiz API: Failed to fetch quiz', id, error);
      throw new Error(`Unable to load quiz "${id}". Please check if it exists and try again.`);
    }
  }

  /**
   * Fetch quizzes by category
   */
  async getQuizzesByCategory(category: string): Promise<Quiz[]> {
    if (!category || category.trim() === '') {
      throw new Error('Category is required');
    }

    try {
      const response = await api.get<Quiz[]>(QUIZ_ENDPOINTS.category(category));
      
      // Validate response structure
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response: Expected array of quizzes');
      }

      console.log('✅ Quiz API: Fetched', response.data.length, 'quizzes for category:', category);
      return response.data;
    } catch (error) {
      console.error('❌ Quiz API: Failed to fetch quizzes by category', category, error);
      throw new Error(`Unable to load quizzes for category "${category}". Please try again.`);
    }
  }

  /**
   * Fetch questions for a quiz
   */
  async getQuizQuestions(quizId: string): Promise<Question[]> {
    if (!quizId || quizId.trim() === '') {
      throw new Error('Quiz ID is required');
    }

    try {
      const response = await api.get<Question[]>(QUIZ_ENDPOINTS.questions(quizId));
      
      // Validate response structure
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response: Expected array of questions');
      }

      console.log('✅ Quiz API: Fetched', response.data.length, 'questions for quiz:', quizId);
      return response.data;
    } catch (error) {
      console.error('❌ Quiz API: Failed to fetch questions for quiz', quizId, error);
      throw new Error(`Unable to load questions for quiz "${quizId}". Please try again.`);
    }
  }

  /**
   * Start a new quiz attempt
   */
  async startQuizAttempt(quizId: string, userId?: string): Promise<QuizAttempt> {
    if (!quizId || quizId.trim() === '') {
      throw new Error('Quiz ID is required');
    }

    try {
      const requestBody = { 
        quizId, 
        ...(userId && { userId }) 
      };

      const response = await api.post<QuizAttempt>(
        QUIZ_ENDPOINTS.attempts, 
        requestBody
      );
      
      // Validate response structure
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response: Expected quiz attempt object');
      }

      console.log('✅ Quiz API: Started quiz attempt:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Quiz API: Failed to start quiz attempt', quizId, error);
      throw new Error(`Unable to start quiz "${quizId}". Please try again.`);
    }
  }

  /**
   * Submit quiz attempt
   */
  async submitQuizAttempt(attemptId: string, answers: QuizAnswer[]): Promise<QuizAttempt> {
    if (!attemptId || attemptId.trim() === '') {
      throw new Error('Attempt ID is required');
    }

    if (!answers || !Array.isArray(answers)) {
      throw new Error('Answers are required and must be an array');
    }

    try {
      // Normalize answers for API submission (convert numbers to strings)
      const normalizedAnswers = answers.map(answer => ({
        ...answer,
        userAnswer: String(answer.userAnswer) // Ensure userAnswer is always string for API
      }));

      const response = await api.put<QuizAttempt>(
        QUIZ_ENDPOINTS.submitAttempt(attemptId),
        { answers: normalizedAnswers }
      );
      
      // Validate response structure
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response: Expected completed quiz attempt');
      }

      console.log('✅ Quiz API: Submitted quiz attempt:', attemptId, 
        'Score:', response.data.score, '/', response.data.totalPoints);
      return response.data;
    } catch (error) {
      console.error('❌ Quiz API: Failed to submit quiz attempt', attemptId, error);
      throw new Error(`Unable to submit quiz answers. Please try again.`);
    }
  }
}

/**
 * Default quiz API service instance
 */
export const quizApiService = new QuizApiService();

/**
 * Convenience functions for direct API calls
 * These provide a simpler interface for common operations
 */
export const quizApi = {
  /**
   * Test API connectivity
   */
  test: () => quizApiService.testConnection(),

  /**
   * Get all quizzes
   */
  getAllQuizzes: () => quizApiService.getQuizzes(),

  /**
   * Get quiz by ID
   */
  getQuiz: (id: string) => quizApiService.getQuizById(id),

  /**
   * Get quizzes by category
   */
  getByCategory: (category: string) => quizApiService.getQuizzesByCategory(category),

  /**
   * Get quiz questions
   */
  getQuestions: (quizId: string) => quizApiService.getQuizQuestions(quizId),

  /**
   * Start quiz attempt
   */
  startAttempt: (quizId: string, userId?: string) => 
    quizApiService.startQuizAttempt(quizId, userId),

  /**
   * Submit quiz attempt
   */
  submitAttempt: (attemptId: string, answers: QuizAnswer[]) => 
    quizApiService.submitQuizAttempt(attemptId, answers)
};

/**
 * Export types for external use
 */
export type { QuizAnswer, QuizAttempt };
