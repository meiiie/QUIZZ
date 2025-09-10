/**
 * Take Quiz Widget - Student MFE
 * 
 * Widget tổng hợp cho chức năng làm quiz
 * Kết hợp: progress bar, question display, navigation
 */

import { useEffect } from 'react';
import { useTakeQuiz } from '../../features/take-quiz/model/useTakeQuiz';
import type { Quiz } from '../../entities/quiz/model/types';
import QuizProgressBar from './ui/QuizProgressBar';
import QuestionDisplay from './ui/QuestionDisplay';
import QuizNavigation from './ui/QuizNavigation';
import Button from '../../shared/ui/Button';

interface TakeQuizWidgetProps {
  quiz: Quiz;
  onComplete?: (score: number, totalPoints: number) => void;
  onExit?: () => void;
}

export default function TakeQuizWidget({ 
  quiz, 
  onComplete,
  onExit 
}: TakeQuizWidgetProps) {
  const {
    // State
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
  } = useTakeQuiz();

  // Start quiz effect
  useEffect(() => {
    if (quiz && !attempt && !isCompleted) {
      startQuiz(quiz);
    }
  }, [quiz, attempt, isCompleted, startQuiz]);

  // Handle completion
  useEffect(() => {
    if (isCompleted && attempt && onComplete) {
      onComplete(attempt.score || 0, attempt.totalPoints || 0);
    }
  }, [isCompleted, attempt, onComplete]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-900 mb-2">Có lỗi xảy ra</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <div className="flex gap-2 justify-center">
          <Button variant="danger" onClick={() => startQuiz(quiz)}>
            Thử lại
          </Button>
          {onExit && (
            <Button variant="secondary" onClick={onExit}>
              Quay về
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Completed state
  if (isCompleted && attempt) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-green-900 mb-2">Hoàn thành bài quiz!</h3>
        <p className="text-green-700 mb-4">
          Bạn đã đạt {attempt.score}/{attempt.totalPoints} điểm 
          ({Math.round(((attempt.score || 0) / (attempt.totalPoints || 1)) * 100)}%)
        </p>
        {onExit && (
          <Button variant="primary" onClick={onExit}>
            Quay về danh sách quiz
          </Button>
        )}
      </div>
    );
  }

  // No questions state
  if (!questions.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không có câu hỏi nào trong quiz này.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestions = new Set(
    Object.keys(answers)
      .map(questionId => questions.findIndex(q => q.id === questionId))
      .filter(index => index !== -1)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
          <p className="text-gray-600 mt-1">{quiz.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            onClick={isActive ? pauseQuiz : resumeQuiz}
            className="flex items-center gap-2"
          >
            {isActive ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Tạm dừng
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Tiếp tục
              </>
            )}
          </Button>
          {onExit && (
            <Button variant="ghost" onClick={onExit}>
              Thoát
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <QuizProgressBar
        currentQuestion={currentQuestionIndex}
        totalQuestions={questions.length}
        answeredQuestions={answeredQuestions.size}
        timeRemaining={timeRemaining}
        isActive={isActive}
      />

      {/* Question Display */}
      <QuestionDisplay
        question={currentQuestion}
        userAnswer={answers[currentQuestion.id]}
        onAnswerChange={(answer) => answerQuestion(currentQuestion.id, answer)}
        isDisabled={!isActive || isSubmitting}
      />

      {/* Navigation */}
      <QuizNavigation
        currentQuestion={currentQuestionIndex}
        totalQuestions={questions.length}
        answeredQuestions={answeredQuestions}
        onGoToQuestion={goToQuestion}
        onPrevious={previousQuestion}
        onNext={nextQuestion}
        onSubmit={submitQuiz}
        canGoNext={currentQuestionIndex < questions.length - 1}
        canGoPrevious={currentQuestionIndex > 0}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
