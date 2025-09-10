/**
 * Quiz History Page
 * 
 * Complete page for viewing quiz completion history and statistics
 * Following FSD page layer principles
 */

import { QuizHistoryList } from '../widgets/QuizHistoryList';
import styles from '../styles/student-mfe.module.css';

export const QuizHistoryPage = () => {
  const handleViewDetails = (attemptId: string) => {
    // TODO: Navigate to attempt details page or show modal
    console.log('View attempt details:', attemptId);
    // Could implement routing to /student/history/:attemptId
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
        <p className="text-gray-600 mt-2">View your completed quizzes and track your learning progress.</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.studentMfeStatsGrid}>
        <div className={styles.studentMfeStatCard}>
          <div className={`${styles.studentMfeStatIcon} ${styles.studentMfeStatIconBlue}`}>
            <span>📚</span>
          </div>
          <div className={styles.studentMfeStatContent}>
            <p className={styles.studentMfeStatLabel}>Total Attempts</p>
            <p className={styles.studentMfeStatValue}>12</p>
          </div>
        </div>

        <div className={styles.studentMfeStatCard}>
          <div className={`${styles.studentMfeStatIcon} ${styles.studentMfeStatIconGreen}`}>
            <span>✅</span>
          </div>
          <div className={styles.studentMfeStatContent}>
            <p className={styles.studentMfeStatLabel}>Completed</p>
            <p className={styles.studentMfeStatValue}>10</p>
          </div>
        </div>

        <div className={styles.studentMfeStatCard}>
          <div className={`${styles.studentMfeStatIcon} ${styles.studentMfeStatIconYellow}`}>
            <span>📊</span>
          </div>
          <div className={styles.studentMfeStatContent}>
            <p className={styles.studentMfeStatLabel}>Average Score</p>
            <p className={styles.studentMfeStatValue}>85%</p>
          </div>
        </div>

        <div className={styles.studentMfeStatCard}>
          <div className={`${styles.studentMfeStatIcon} ${styles.studentMfeStatIconPurple}`}>
            <span>⏱️</span>
          </div>
          <div className={styles.studentMfeStatContent}>
            <p className={styles.studentMfeStatLabel}>Time Spent</p>
            <p className={styles.studentMfeStatValue}>24h</p>
          </div>
        </div>
      </div>

      {/* Quiz History List */}
      <QuizHistoryList 
        onViewDetails={handleViewDetails}
        showStats={true}
      />
    </div>
  );
};
