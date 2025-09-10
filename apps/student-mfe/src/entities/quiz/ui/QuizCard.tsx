import { type FC } from 'react';
import type { Quiz } from '../model/types';
import styles from '../../../styles/student-mfe.module.css';

export interface QuizCardProps {
  quiz: Quiz;
  onStartQuiz?: (quizId: string) => void;
  onViewDetails?: (quizId: string) => void;
  showActions?: boolean;
}

const QuizCard: FC<QuizCardProps> = ({
  quiz,
  onStartQuiz,
  onViewDetails,
  showActions = true
}) => {
  const getDifficultyClass = (difficulty: Quiz['difficulty']) => {
    switch (difficulty) {
      case 'easy': return styles.studentMfeQuizDifficultyEasy;
      case 'medium': return styles.studentMfeQuizDifficultyMedium;
      case 'hard': return styles.studentMfeQuizDifficultyHard;
      default: return styles.studentMfeQuizDifficultyEasy;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className={styles.studentMfeQuizCard}>
      <div className={styles.studentMfeQuizHeader}>
        <h3 className={styles.studentMfeQuizTitle}>
          {quiz.title}
        </h3>
        <span className={`${styles.studentMfeQuizDifficulty} ${getDifficultyClass(quiz.difficulty)}`}>
          {quiz.difficulty}
        </span>
      </div>
      
      <p className={styles.studentMfeQuizDescription}>
        {quiz.description}
      </p>
      
      <div className={styles.studentMfeQuizMeta}>
        <div className={styles.studentMfeQuizMetaItem}>
          <span className={styles.studentMfeQuizMetaIcon}>📝</span>
          <span>{quiz.totalQuestions} questions</span>
        </div>
        <div className={styles.studentMfeQuizMetaItem}>
          <span className={styles.studentMfeQuizMetaIcon}>⏱️</span>
          <span>{formatDuration(quiz.duration)}</span>
        </div>
        <div className={styles.studentMfeQuizMetaItem}>
          <span className={styles.studentMfeQuizMetaIcon}>📂</span>
          <span className="truncate">{quiz.category}</span>
        </div>
      </div>
      
      {!quiz.isAvailable && (
        <div className="text-orange-600 text-sm mb-4 flex items-center bg-orange-50 p-3 rounded-lg">
          <span className="mr-2">🔒</span>
          <span>Not available yet</span>
        </div>
      )}
      
      {showActions && quiz.isAvailable && (
        <div className={styles.studentMfeQuizActions}>
          <button
            onClick={() => onStartQuiz?.(quiz.id)}
            className={`${styles.studentMfeQuizButton} ${styles.studentMfeQuizButtonPrimary}`}
          >
            Start Quiz
          </button>
          <button
            onClick={() => onViewDetails?.(quiz.id)}
            className={`${styles.studentMfeQuizButton} ${styles.studentMfeQuizButtonSecondary}`}
          >
            Details
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
