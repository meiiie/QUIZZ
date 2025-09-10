/**
 * MSW Database - Student MFE
 * 
 * Centralized mock data management for MSW
 * Follows Database-like structure for professional mocking
 */

import type { Quiz, Question, QuizAttempt } from '../../../entities/quiz/model/types';
import type { QuizAttempt as HistoryAttempt } from '../../../entities/history/model/types';

/**
 * Mock Quizzes Database
 * Enterprise-quality test data
 */
export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'quiz_1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of core JavaScript concepts including variables, functions, and scope.',
    duration: 30,
    totalQuestions: 15,
    difficulty: 'medium',
    category: 'Programming',
    isAvailable: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'quiz_2', 
    title: 'React Hooks Deep Dive',
    description: 'Advanced React concepts focusing on useState, useEffect, and custom hooks.',
    duration: 45,
    totalQuestions: 20,
    difficulty: 'hard',
    category: 'Frontend',
    isAvailable: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'quiz_3',
    title: 'CSS Grid & Flexbox',
    description: 'Master modern CSS layout techniques with practical examples.',
    duration: 25,
    totalQuestions: 12,
    difficulty: 'easy',
    category: 'CSS',
    isAvailable: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-12')
  },
  {
    id: 'quiz_4',
    title: 'TypeScript Advanced Types',
    description: 'Explore conditional types, mapped types, and template literal types.',
    duration: 60,
    totalQuestions: 25,
    difficulty: 'hard',
    category: 'Programming',
    isAvailable: false, // Not available - for testing
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-16')
  }
];

/**
 * Mock Questions Database
 * Organized by quiz ID for efficient lookup
 */
export const MOCK_QUESTIONS: Record<string, Question[]> = {
  quiz_1: [
    {
      id: 'q1_1',
      quizId: 'quiz_1',
      type: 'multiple-choice',
      question: 'What is the correct way to declare a variable in JavaScript?',
      options: ['var myVar = 5', 'let myVar = 5', 'const myVar = 5', 'All of the above'],
      correctAnswer: 'All of the above',
      points: 2,
      explanation: 'All three keywords (var, let, const) can be used to declare variables, each with different scoping rules.'
    },
    {
      id: 'q1_2',
      quizId: 'quiz_1',
      type: 'true-false',
      question: 'JavaScript is a statically typed language.',
      correctAnswer: 'false',
      points: 1,
      explanation: 'JavaScript is dynamically typed, meaning variable types are determined at runtime.'
    },
    {
      id: 'q1_3',
      quizId: 'quiz_1',
      type: 'short-answer',
      question: 'Explain what hoisting means in JavaScript.',
      correctAnswer: 'Variable and function declarations are moved to the top of their scope',
      points: 3,
      explanation: 'Hoisting is a JavaScript mechanism where variables and function declarations are moved to the top of their containing scope during compilation.'
    }
  ],
  quiz_2: [
    {
      id: 'q2_1',
      quizId: 'quiz_2',
      type: 'multiple-choice',
      question: 'Which hook is used for side effects in React?',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      correctAnswer: 'useEffect',
      points: 2,
      explanation: 'useEffect is specifically designed for handling side effects like API calls, subscriptions, and DOM manipulation.'
    },
    {
      id: 'q2_2',
      quizId: 'quiz_2',
      type: 'true-false',
      question: 'useEffect runs after every render by default.',
      correctAnswer: 'true',
      points: 1,
      explanation: 'Without a dependency array, useEffect runs after every render (both mount and update).'
    }
  ]
};

/**
 * In-memory storage for quiz attempts
 * Simulates database state in development
 */
export class MockDatabase {
  private attempts: QuizAttempt[] = [];
  private attemptIdCounter = 1;

  /**
   * Get all quizzes (filtered by availability)
   */
  getQuizzes(): Quiz[] {
    return MOCK_QUIZZES.filter(quiz => quiz.isAvailable);
  }

  /**
   * Get quiz by ID
   */
  getQuizById(id: string): Quiz | null {
    return MOCK_QUIZZES.find(quiz => quiz.id === id && quiz.isAvailable) || null;
  }

  /**
   * Get quizzes by category
   */
  getQuizzesByCategory(category: string): Quiz[] {
    return MOCK_QUIZZES.filter(quiz => 
      quiz.isAvailable && 
      (category === 'all' || quiz.category.toLowerCase() === category.toLowerCase())
    );
  }

  /**
   * Get questions for a quiz
   */
  getQuizQuestions(quizId: string): Question[] {
    const questions = MOCK_QUESTIONS[quizId] || [];
    // Shuffle questions for randomization
    return [...questions].sort(() => Math.random() - 0.5);
  }

  /**
   * Create a new quiz attempt
   */
  createQuizAttempt(quizId: string, userId: string = 'student_1'): QuizAttempt {
    const attempt: QuizAttempt = {
      id: `attempt_${this.attemptIdCounter++}`,
      quizId,
      userId,
      startedAt: new Date(),
      answers: [],
      status: 'in-progress'
    };

    this.attempts.push(attempt);
    return attempt;
  }

  /**
   * Submit quiz attempt with scoring
   */
  submitQuizAttempt(attemptId: string, answers: any[]): QuizAttempt | null {
    const attemptIndex = this.attempts.findIndex(a => a.id === attemptId);
    if (attemptIndex === -1) {
      return null;
    }

    const attempt = this.attempts[attemptIndex];
    const questions = this.getQuizQuestions(attempt.quizId);
    
    // Calculate score
    let totalScore = 0;
    let totalPoints = 0;
    
    const processedAnswers = answers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) return answer;
      
      totalPoints += question.points;
      const isCorrect = String(answer.userAnswer).toLowerCase() === String(question.correctAnswer).toLowerCase();
      const pointsEarned = isCorrect ? question.points : 0;
      totalScore += pointsEarned;
      
      return {
        ...answer,
        isCorrect,
        pointsEarned
      };
    });

    // Update attempt
    const completedAttempt: QuizAttempt = {
      ...attempt,
      completedAt: new Date(),
      score: totalScore,
      totalPoints,
      answers: processedAnswers,
      status: 'completed'
    };

    this.attempts[attemptIndex] = completedAttempt;
    return completedAttempt;
  }
}

/**
 * Mock Quiz History Database
 * Professional mock data for quiz completion history
 */
export const MOCK_HISTORY: HistoryAttempt[] = [
  {
    id: 'attempt-1',
    quizId: 'quiz_1',
    quizTitle: 'JavaScript Fundamentals',
    subject: 'Programming',
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    score: 12,
    totalQuestions: 15,
    timeSpent: 1850, // 30:50 minutes
    status: 'completed',
  },
  {
    id: 'attempt-2', 
    quizId: 'quiz_2',
    quizTitle: 'React Hooks Deep Dive',
    subject: 'Programming',
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    score: 18,
    totalQuestions: 20,
    timeSpent: 2760, // 46:00 minutes
    status: 'completed',
  },
  {
    id: 'attempt-3',
    quizId: 'quiz_3', 
    quizTitle: 'CSS Grid & Flexbox',
    subject: 'Web Design',
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    score: 8,
    totalQuestions: 12,
    timeSpent: 1420, // 23:40 minutes
    status: 'completed',
  },
  {
    id: 'attempt-4',
    quizId: 'quiz_1',
    quizTitle: 'JavaScript Fundamentals', 
    subject: 'Programming',
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    score: 10,
    totalQuestions: 15,
    timeSpent: 1680, // 28:00 minutes
    status: 'completed',
  },
  {
    id: 'attempt-5',
    quizId: 'quiz_2',
    quizTitle: 'React Hooks Deep Dive',
    subject: 'Programming', 
    completedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
    score: 15,
    totalQuestions: 20,
    timeSpent: 3120, // 52:00 minutes
    status: 'completed',
  }
];

/**
 * Global mock database instance
 * Singleton pattern for consistent state
 */
export const mockDb = new MockDatabase();
