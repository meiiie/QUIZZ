/**
 * Question Display Widget - Student MFE
 * 
 * Component hiển thị câu hỏi và các lựa chọn trả lời
 * Hỗ trợ: multiple choice, true/false, essay
 */

import type { Question } from '../../../entities/quiz/model/types';
import Button from '../../../shared/ui/Button';

interface QuestionDisplayProps {
  question: Question;
  userAnswer?: string | number;
  onAnswerChange: (answer: string | number) => void;
  isDisabled?: boolean;
}

export default function QuestionDisplay({
  question,
  userAnswer,
  onAnswerChange,
  isDisabled = false
}: QuestionDisplayProps) {
  
  /**
   * Render multiple choice options
   */
  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
        const optionKey = String.fromCharCode(65 + index); // A, B, C, D
        const isSelected = userAnswer === option;
        
        return (
          <button
            key={index}
            onClick={() => onAnswerChange(option)}
            disabled={isDisabled}
            className={`
              w-full text-left p-4 rounded-lg border transition-all
              ${isSelected 
                ? 'border-blue-500 bg-blue-50 text-blue-900' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-3">
              <span className={`
                flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium
                ${isSelected 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-300 text-gray-600'
                }
              `}>
                {optionKey}
              </span>
              <span className="flex-1">{option}</span>
            </div>
          </button>
        );
      })}
    </div>
  );

  /**
   * Render true/false options
   */
  const renderTrueFalse = () => (
    <div className="space-y-3">
      {[true, false].map((value) => {
        const isSelected = userAnswer === String(value);
        const label = value ? 'Đúng' : 'Sai';
        const icon = value ? '✓' : '✗';
        
        return (
          <button
            key={String(value)}
            onClick={() => onAnswerChange(String(value))}
            disabled={isDisabled}
            className={`
              w-full text-left p-4 rounded-lg border transition-all
              ${isSelected 
                ? `border-${value ? 'green' : 'red'}-500 bg-${value ? 'green' : 'red'}-50 text-${value ? 'green' : 'red'}-900` 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className={`
                flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium
                ${isSelected 
                  ? `border-${value ? 'green' : 'red'}-500 bg-${value ? 'green' : 'red'}-500 text-white`
                  : 'border-gray-300 text-gray-600'
                }
              `}>
                {icon}
              </span>
              <span className="flex-1 font-medium">{label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );

  /**
   * Render short answer text area
   */
  const renderShortAnswer = () => (
    <div>
      <textarea
        value={userAnswer as string || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={isDisabled}
        placeholder="Nhập câu trả lời của bạn..."
        className={`
          w-full min-h-32 p-4 border border-gray-200 rounded-lg resize-y
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
        `}
      />
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Gõ câu trả lời chi tiết của bạn</span>
        <span>{String(userAnswer || '').length} ký tự</span>
      </div>
    </div>
  );

  /**
   * Get question type icon
   */
  const getQuestionIcon = () => {
    switch (question.type) {
      case 'multiple-choice':
        return '📝';
      case 'true-false':
        return '❓';
      case 'short-answer':
        return '📄';
      default:
        return '❔';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-6">
        <span className="text-2xl">{getQuestionIcon()}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {question.type === 'multiple-choice' ? 'Trắc nghiệm' : 
               question.type === 'true-false' ? 'Đúng/Sai' : 'Tự luận'}
            </span>
            <span className="text-sm text-gray-400">
              {question.points} điểm
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
            {question.question}
          </h3>
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-6">
        {question.type === 'multiple-choice' && renderMultipleChoice()}
        {question.type === 'true-false' && renderTrueFalse()}
        {question.type === 'short-answer' && renderShortAnswer()}
      </div>

      {/* Answer Status */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {userAnswer !== undefined && userAnswer !== '' ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">Đã trả lời</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-500">Chưa trả lời</span>
            </>
          )}
        </div>
        
        {userAnswer !== undefined && userAnswer !== '' && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onAnswerChange('')}
            disabled={isDisabled}
          >
            Xóa câu trả lời
          </Button>
        )}
      </div>
    </div>
  );
}
