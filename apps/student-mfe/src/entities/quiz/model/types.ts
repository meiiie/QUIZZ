/**
 * Quiz Entity Types
 * Business domain entities for quiz functionality
 */

export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  quizId: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | number;
  points: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  totalPoints?: number;
  answers: QuizAnswer[];
  status: 'in-progress' | 'completed' | 'abandoned';
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: string | number;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface QuizResult {
  attemptId: string;
  quiz: Quiz;
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpent: number; // in minutes
  completedAt: Date;
  answers: QuizAnswer[];
}
