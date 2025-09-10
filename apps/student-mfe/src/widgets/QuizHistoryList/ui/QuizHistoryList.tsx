/**
 * QuizHistoryList Widget
 * 
 * Complete quiz history display with loading states and error handling
 * Professional UI following FSD widget layer principles
 */

import { useQuizHistory } from '../../../features/quiz-history/model/useQuizHistory';
import { HistoryItem } from '../../../entities/history/ui/HistoryItem';
import { Button } from '../../../shared/ui';

interface QuizHistoryListProps {
  onViewDetails?: (attemptId: string) => void;
  showStats?: boolean;
}

export const QuizHistoryList = ({ onViewDetails, showStats = true }: QuizHistoryListProps) => {
  const { history, stats, isLoading, error, refreshHistory, clearError, hasHistory, isEmpty } = useQuizHistory();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử làm bài...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không thể tải lịch sử</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
        <div className="space-x-4">
          <Button 
            onClick={refreshHistory}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            🔄 Thử lại
          </Button>
          <Button 
            onClick={clearError}
            variant="secondary"
          >
            Đóng
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch sử làm bài</h3>
          <p className="text-gray-600 mb-4">
            Bạn chưa hoàn thành bài kiểm tra nào. Hãy bắt đầu làm bài để xem kết quả tại đây.
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/student/dashboard'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          🎯 Bắt đầu làm bài
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Section */}
      {showStats && stats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Thống kê tổng quan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalAttempts}</div>
              <div className="text-sm text-gray-600">Tổng bài làm</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(stats.averageScore)}%</div>
              <div className="text-sm text-gray-600">Điểm trung bình</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(stats.bestScore)}%</div>
              <div className="text-sm text-gray-600">Điểm cao nhất</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.floor(stats.totalTimeSpent / 60)}
              </div>
              <div className="text-sm text-gray-600">Phút đã học</div>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            📚 Lịch sử làm bài ({history.length})
          </h3>
          <Button 
            onClick={refreshHistory}
            variant="secondary"
            size="sm"
          >
            🔄 Làm mới
          </Button>
        </div>

        <div className="space-y-3">
          {history.map((attempt) => (
            <HistoryItem 
              key={attempt.id} 
              attempt={attempt}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Load More / Pagination could go here */}
      {hasHistory && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Hiển thị {history.length} kết quả gần nhất
          </p>
        </div>
      )}
    </div>
  );
};
