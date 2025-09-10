/**
 * HistoryItem Component - Quiz History Entity UI
 * 
 * Displays individual quiz attempt in history list
 * Pure presentation component following FSD entity principles
 */

import { Card } from '../../../shared/ui';
import type { QuizAttempt } from '../model/types';

interface HistoryItemProps {
  attempt: QuizAttempt;
  onViewDetails?: (attemptId: string) => void;
}

export const HistoryItem = ({ attempt, onViewDetails }: HistoryItemProps) => {
  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const date = new Date(attempt.completedAt).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800';
    if (percentage >= 60) return 'bg-blue-100 text-blue-800';
    if (percentage >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatTimeSpent = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="flex justify-between items-center p-4 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-lg text-gray-900">
            {attempt.quizTitle}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreBadge(percentage)}`}>
            {percentage}%
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            📚 {attempt.subject}
          </span>
          <span className="flex items-center gap-1">
            📅 {date}
          </span>
          {attempt.timeSpent && (
            <span className="flex items-center gap-1">
              ⏱️ {formatTimeSpent(attempt.timeSpent)}
            </span>
          )}
        </div>
      </div>

      <div className="text-right ml-4">
        <p className={`font-bold text-2xl ${getScoreColor(percentage)}`}>
          {percentage}%
        </p>
        <p className="text-sm text-gray-600 mb-2">
          {attempt.score}/{attempt.totalQuestions} câu đúng
        </p>
        
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(attempt.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Xem chi tiết →
          </button>
        )}
      </div>
    </Card>
  );
};
