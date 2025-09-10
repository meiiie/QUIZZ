/**
 * Take Quiz Page - Student MFE
 * 
 * Page hoàn chỉnh cho việc làm quiz
 * Sử dụng TakeQuizWidget và handle navigation
 */

import { useState, useEffect } from 'react';
import { useView } from '../shared/lib/viewManager';
import TakeQuizWidget from '../widgets/TakeQuiz';
import type { Quiz } from '../entities/quiz/model/types';
import { quizAPI } from '../shared/api';

interface TakeQuizPageProps {
  quizId?: string;
}

export default function TakeQuizPage({ quizId: propQuizId }: TakeQuizPageProps) {
  const { setView, viewParams } = useView();
  const quizId = propQuizId || viewParams.quizId;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) {
        setError('Quiz ID không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const quizData = await quizAPI.getQuiz(quizId);
        if (!quizData) {
          setError('Không tìm thấy quiz');
          return;
        }
        
        setQuiz(quizData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải quiz';
        setError(errorMessage);
        console.error('Error loading quiz:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // Handle quiz completion
  const handleComplete = (score: number, totalPoints: number) => {
    console.log(`Quiz completed: ${score}/${totalPoints}`);
    // Could show results modal or navigate to results page
    // For now, just navigate back to quiz list after a delay
    setTimeout(() => {
      setView('quizzes');
    }, 3000);
  };

  // Handle exit
  const handleExit = () => {
    setView('quizzes');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không thể tải quiz</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleExit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay về danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="mt-1 text-gray-600">{quiz.description}</p>
              </div>
              <button
                onClick={handleExit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ← Exit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TakeQuizWidget
          quiz={quiz}
          onComplete={handleComplete}
          onExit={handleExit}
        />
      </div>
    </div>
  );
}
