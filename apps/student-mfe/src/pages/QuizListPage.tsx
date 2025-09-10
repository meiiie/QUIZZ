/**
 * Quiz List Page - Student MFE
 * 
 * Trang hiển thị danh sách quiz với design chuyên nghiệp
 * Theo FSD: Pages kết hợp các widgets để tạo thành trang hoàn chỉnh
 */

import { type FC } from 'react';
import { useView } from '../shared/lib/viewManager';
import { QuizList } from '../widgets/QuizList/ui/QuizList';

const QuizListPage: FC = () => {
  const { setView } = useView();
  
  const handleQuizSelect = (quizId: string) => {
    console.log('User selected quiz:', quizId);
    // Navigate to take-quiz view with quizId parameter
    setView('take-quiz', { quizId });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
        <p className="text-gray-600 mt-2">Choose a quiz to test your knowledge and skills. Filter by category or difficulty level.</p>
      </div>

      {/* Quiz List Widget */}
      <QuizList 
        onQuizSelect={handleQuizSelect}
        showFilters={true}
      />
    </div>
  );
};

export default QuizListPage;
