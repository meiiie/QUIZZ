/**
 * Quiz Progress Bar Widget - Student MFE
 * 
 * Thanh progress bar hiển thị tiến độ làm bài quiz
 * Bao gồm: question progress, answered status, timer display
 */

interface QuizProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  timeRemaining: number; // in seconds
  isActive: boolean;
}

/**
 * Format seconds to MM:SS
 */
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Get timer color based on remaining time
 */
const getTimerColor = (timeRemaining: number, totalTime: number = 3600): string => {
  const percentage = (timeRemaining / totalTime) * 100;
  
  if (percentage > 50) return 'text-green-600';
  if (percentage > 20) return 'text-yellow-600';
  return 'text-red-600';
};

export default function QuizProgressBar({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  timeRemaining,
  isActive
}: QuizProgressBarProps) {
  const progressPercentage = ((currentQuestion) / totalQuestions) * 100;
  const answeredPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Câu hỏi {currentQuestion + 1} / {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            Đã trả lời: {answeredQuestions}/{totalQuestions}
          </span>
        </div>
        
        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 ${isActive ? '' : 'opacity-50'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className={`font-mono font-medium ${getTimerColor(timeRemaining)}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          {!isActive && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              Tạm dừng
            </span>
          )}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        {/* Question Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Tiến độ làm bài</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Answered Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Câu đã trả lời</span>
            <span>{Math.round(answeredPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${answeredPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warning if many unanswered questions */}
      {(totalQuestions - answeredQuestions > 3) && currentQuestion > totalQuestions * 0.7 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          ⚠️ Bạn còn {totalQuestions - answeredQuestions} câu chưa trả lời
        </div>
      )}
    </div>
  );
}
