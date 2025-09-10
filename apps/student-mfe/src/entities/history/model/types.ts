/**
 * Quiz History Entity Types
 * 
 * Defines core data structures for quiz completion history
 * Following FSD entity layer principles
 */

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  completedAt: string; // ISO format for easy data transfer
  score: number;
  totalQuestions: number;
  timeSpent?: number; // in seconds
  status: 'completed' | 'abandoned';
}

export interface QuizHistoryStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  completionRate: number;
}

export type QuizHistoryFilter = {
  subject?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: QuizAttempt['status'];
};
