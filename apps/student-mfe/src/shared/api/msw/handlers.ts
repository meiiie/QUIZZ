/**
 * MSW API Handlers - Student MFE
 * 
 * Centralized mock API definitions following REST conventions
 * Professional-grade mocking using database pattern
 */

import { http, HttpResponse, delay } from 'msw';
import { mockDb, MOCK_HISTORY } from './db';

// In-memory storage for quiz attempts (will be enhanced later)
interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect?: boolean;
  pointsEarned?: number;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: Date;
  completedAt?: Date;
  answers: QuizAnswer[];
  score?: number;
  totalPoints?: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}

let mockAttempts: QuizAttempt[] = [];
let attemptIdCounter = 1;

/**
 * Quiz API Handlers
 */
export const quizHandlers = [
  // Test endpoint to verify MSW is working
  http.get('/api/test', () => {
    console.log('🎯 MSW: Test endpoint hit!');
    return HttpResponse.json({ 
      message: 'MSW is working!', 
      timestamp: new Date().toISOString(),
      service: 'Student MFE'
    });
  }),

  // GET /api/quizzes - Fetch all available quizzes
  http.get('/api/quizzes', async () => {
    console.log('🎯 MSW: Intercepted GET /api/quizzes');
    await delay(800); // Simulate network latency
    
    // Simulate occasional network errors (5% chance)
    if (Math.random() < 0.05) {
      console.log('❌ MSW: Simulating network error for /api/quizzes');
      return HttpResponse.json(
        { error: 'Network timeout. Please try again.' },
        { status: 500 }
      );
    }

    const quizzes = mockDb.getQuizzes();
    console.log('✅ MSW: Returning', quizzes.length, 'quizzes');
    return HttpResponse.json(quizzes);
  }),

  // GET /api/quizzes/:id - Fetch quiz by ID
  http.get('/api/quizzes/:id', async ({ params }) => {
    console.log('🎯 MSW: Intercepted GET /api/quizzes/:id');
    await delay(500);
    
    const { id } = params;
    const quiz = mockDb.getQuizById(id as string);
    
    if (!quiz) {
      console.log('❌ MSW: Quiz not found:', id);
      return HttpResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    if (!quiz.isAvailable) {
      console.log('❌ MSW: Quiz not available:', id);
      return HttpResponse.json(
        { error: 'Quiz is not available' },
        { status: 403 }
      );
    }

    console.log('✅ MSW: Returning quiz:', quiz.title);
    return HttpResponse.json(quiz);
  }),

  // GET /api/quizzes/category/:category - Filter by category
  http.get('/api/quizzes/category/:category', async ({ params }) => {
    console.log('🎯 MSW: Intercepted GET /api/quizzes/category/:category');
    await delay(600);
    
    const { category } = params;
    const allQuizzes = mockDb.getQuizzes();
    
    const filteredQuizzes = allQuizzes.filter(quiz => 
      category === 'all' || 
      quiz.category.toLowerCase() === (category as string).toLowerCase()
    );

    console.log('✅ MSW: Returning', filteredQuizzes.length, 'quizzes for category:', category);
    return HttpResponse.json(filteredQuizzes);
  }),

  // GET /api/quizzes/:id/questions - Fetch questions for a quiz
  http.get('/api/quizzes/:id/questions', async ({ params }) => {
    console.log('🎯 MSW: Intercepted GET /api/quizzes/:id/questions');
    await delay(1000);
    
    const { id } = params;
    const questions = mockDb.getQuizQuestions(id as string);
    
    if (!questions || questions.length === 0) {
      console.log('❌ MSW: Questions not found for quiz:', id);
      return HttpResponse.json(
        { error: 'Questions not found for this quiz' },
        { status: 404 }
      );
    }

    console.log('✅ MSW: Returning', questions.length, 'questions for quiz:', id);
    return HttpResponse.json(questions);
  }),

  // POST /api/quiz-attempts - Start a new quiz attempt
  http.post('/api/quiz-attempts', async ({ request }) => {
    console.log('🎯 MSW: Intercepted POST /api/quiz-attempts');
    await delay(300);
    
    const body = await request.json() as { quizId: string; userId?: string };
    const { quizId, userId = 'student_1' } = body;
    
    const quiz = mockDb.getQuizById(quizId);
    if (!quiz) {
      console.log('❌ MSW: Quiz not found for attempt:', quizId);
      return HttpResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    const attempt: QuizAttempt = {
      id: `attempt_${attemptIdCounter++}`,
      quizId,
      userId,
      startedAt: new Date(),
      answers: [],
      status: 'in-progress'
    };

    mockAttempts.push(attempt);
    console.log('✅ MSW: Created quiz attempt:', attempt.id);
    return HttpResponse.json(attempt, { status: 201 });
  }),

  // PUT /api/quiz-attempts/:id/submit - Submit quiz attempt
  http.put('/api/quiz-attempts/:id/submit', async ({ params, request }) => {
    console.log('🎯 MSW: Intercepted PUT /api/quiz-attempts/:id/submit');
    await delay(800);
    
    const { id } = params;
    const body = await request.json() as { answers: QuizAnswer[] };
    const { answers } = body;
    
    const attemptIndex = mockAttempts.findIndex(a => a.id === id);
    if (attemptIndex === -1) {
      console.log('❌ MSW: Quiz attempt not found:', id);
      return HttpResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }

    const attempt = mockAttempts[attemptIndex];
    const questions = mockDb.getQuizQuestions(attempt.quizId) || [];
    
    // Calculate score
    let totalScore = 0;
    let totalPoints = 0;
    
    const processedAnswers = answers.map(answer => {
      const question = questions.find((q: any) => q.id === answer.questionId);
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

    mockAttempts[attemptIndex] = completedAttempt;
    console.log('✅ MSW: Completed quiz attempt:', id, 'Score:', totalScore, '/', totalPoints);
    return HttpResponse.json(completedAttempt);
  })
];

/**
 * Quiz History API Handlers
 */
export const historyHandlers = [
  // GET /api/history - Fetch quiz completion history
  http.get('/api/history', async () => {
    console.log('🎯 MSW: Intercepted GET /api/history');
    await delay(600); // Simulate network latency
    
    // Sort by completion date (newest first)
    const sortedHistory = [...MOCK_HISTORY].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    console.log('✅ MSW: Returning', sortedHistory.length, 'history records');
    return HttpResponse.json(sortedHistory);
  }),

  // GET /api/history/stats - Fetch quiz history statistics
  http.get('/api/history/stats', async () => {
    console.log('🎯 MSW: Intercepted GET /api/history/stats');
    await delay(400);
    
    const stats = {
      totalAttempts: MOCK_HISTORY.length,
      averageScore: MOCK_HISTORY.reduce((acc, attempt) => 
        acc + (attempt.score / attempt.totalQuestions * 100), 0) / MOCK_HISTORY.length,
      bestScore: Math.max(...MOCK_HISTORY.map(attempt => 
        attempt.score / attempt.totalQuestions * 100)),
      totalTimeSpent: MOCK_HISTORY.reduce((acc, attempt) => 
        acc + (attempt.timeSpent || 0), 0),
      completionRate: MOCK_HISTORY.filter(attempt => 
        attempt.status === 'completed').length / MOCK_HISTORY.length * 100
    };
    
    console.log('✅ MSW: Returning quiz history stats');
    return HttpResponse.json(stats);
  })
];

/**
 * Export all handlers
 */
export const handlers = [
  ...quizHandlers,
  ...historyHandlers
];
