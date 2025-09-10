/**
 * Quiz Navigation Widget - Student MFE
 * 
 * Component điều hướng giữa các câu hỏi trong quiz
 * Bao gồm: question overview, navigation controls, submit actions
 */

import Button from '../../../shared/ui/Button';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  onGoToQuestion: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isSubmitting: boolean;
}

export default function QuizNavigation({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onGoToQuestion,
  onPrevious,
  onNext,
  onSubmit,
  canGoNext,
  canGoPrevious,
  isSubmitting
}: QuizNavigationProps) {
  
  const isLastQuestion = currentQuestion === totalQuestions - 1;
  const allQuestionsAnswered = answeredQuestions.size === totalQuestions;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Question Grid Overview */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Tổng quan câu hỏi
        </h4>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {Array.from({ length: totalQuestions }, (_, index) => {
            const isAnswered = answeredQuestions.has(index);
            const isCurrent = index === currentQuestion;
            
            return (
              <button
                key={index}
                onClick={() => onGoToQuestion(index)}
                className={`
                  w-8 h-8 rounded text-xs font-medium border transition-all
                  ${isCurrent
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : isAnswered
                    ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                    : 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border border-blue-500 bg-blue-500"></div>
            <span>Hiện tại</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border border-green-500 bg-green-50"></div>
            <span>Đã trả lời</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border border-gray-300 bg-gray-50"></div>
            <span>Chưa trả lời</span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Câu trước
        </Button>

        {/* Question Info */}
        <div className="text-center">
          <div className="text-sm text-gray-500">
            Câu {currentQuestion + 1} / {totalQuestions}
          </div>
          <div className="text-xs text-gray-400">
            {answeredQuestions.size} / {totalQuestions} đã trả lời
          </div>
        </div>

        {/* Next/Submit Button */}
        {isLastQuestion ? (
          <Button
            variant={allQuestionsAnswered ? "primary" : "secondary"}
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Đang nộp...
              </>
            ) : (
              <>
                Nộp bài
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-2"
          >
            Câu tiếp
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        )}
      </div>

      {/* Submit Warning */}
      {isLastQuestion && !allQuestionsAnswered && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Còn {totalQuestions - answeredQuestions.size} câu chưa trả lời
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Bạn có thể nộp bài mà không cần trả lời hết tất cả câu hỏi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
