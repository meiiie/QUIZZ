/**
 * Take Quiz Feature Hook - Student MFE
 * 
 * Complex feature hook để quản lý toàn bộ quiz taking flow
 * Bao gồm: loading questions, timer, progress, answers, submission
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Quiz, Question, QuizAttempt, QuizAnswer } from '../../../entities/quiz/model/types';
import { quizAPI } from '../../../shared/api';

interface UseTakeQuizState {
  // Quiz data
  quiz: Quiz | null;
  questions: Question[];
  currentQuestionIndex: number;
  
  // User interaction
  answers: Record<string, string | number>; // questionId -> answer
  
  // Quiz session
  attempt: QuizAttempt | null;
  isActive: boolean;
  timeRemaining: number; // in seconds
  
  // UI states
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  isCompleted: boolean;
}

interface UseTakeQuizActions {
  startQuiz: (quiz: Quiz) => Promise<void>;
  answerQuestion: (questionId: string, answer: string | number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitQuiz: () => Promise<QuizAttempt | null>;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
}

type UseTakeQuizReturn = UseTakeQuizState & UseTakeQuizActions;

/**
 * Hook quản lý toàn bộ quiz taking experience
 */
export const useTakeQuiz = (): UseTakeQuizReturn => {
  // Core state
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  /**
   * Timer effect
   */
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            // Auto submit when time is up
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  /**
   * Auto submit when time runs out
   */
  const handleAutoSubmit = useCallback(async () => {
    console.log('⏰ Time up! Auto-submitting quiz...');
    if (attempt) {
      await submitQuiz();
    }
  }, [attempt]);

  /**
   * Start quiz - load questions and initialize timer
   */
  const startQuiz = async (quizData: Quiz) => {
    try {
      setIsLoading(true);
      setError(null);
      setQuiz(quizData);
      
      // Load questions
      const quizQuestions = await quizAPI.getQuizQuestions(quizData.id);
      setQuestions(quizQuestions);
      
      // Start attempt
      const newAttempt = await quizAPI.startQuizAttempt(quizData.id);
      setAttempt(newAttempt);
      
      // Initialize timer (quiz duration in seconds)
      const totalSeconds = quizData.duration * 60;
      setTimeRemaining(totalSeconds);
      setIsActive(true);
      
      // Reset state
      setCurrentQuestionIndex(0);
      setAnswers({});
      setIsCompleted(false);
      
      console.log(`🚀 Quiz started: ${quizData.title}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start quiz';
      setError(errorMessage);
      console.error('Error starting quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Answer a question
   */
  const answerQuestion = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    console.log(`💡 Question answered: ${questionId} = ${answer}`);
  };

  /**
   * Navigation functions
   */
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  /**
   * Submit quiz
   */
  const submitQuiz = async (): Promise<QuizAttempt | null> => {
    if (!attempt || !questions.length) {
      setError('No active quiz attempt found');
      return null;
    }

    try {
      setIsSubmitting(true);
      setIsActive(false); // Stop timer
      
      // Convert answers to QuizAnswer format
      const formattedAnswers: QuizAnswer[] = questions.map(question => ({
        questionId: question.id,
        userAnswer: answers[question.id] ?? '', // Default to empty if not answered
      }));

      // Submit to API
      const completedAttempt = await quizAPI.submitQuizAttempt(attempt.id, formattedAnswers);
      setAttempt(completedAttempt);
      setIsCompleted(true);
      
      console.log('✅ Quiz submitted successfully');
      return completedAttempt;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz';
      setError(errorMessage);
      console.error('Error submitting quiz:', err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Pause/Resume quiz
   */
  const pauseQuiz = () => {
    setIsActive(false);
    console.log('⏸️ Quiz paused');
  };

  const resumeQuiz = () => {
    if (timeRemaining > 0 && !isCompleted) {
      setIsActive(true);
      console.log('▶️ Quiz resumed');
    }
  };

  return {
    // State
    quiz,
    questions,
    currentQuestionIndex,
    answers,
    attempt,
    isActive,
    timeRemaining,
    isLoading,
    isSubmitting,
    error,
    isCompleted,
    
    // Actions
    startQuiz,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    pauseQuiz,
    resumeQuiz
  };
};
