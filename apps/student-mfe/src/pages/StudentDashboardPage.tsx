import { type FC } from 'react';
import { useView } from '../shared/lib/viewManager';
import styles from '../styles/student-mfe.module.css';

export const StudentDashboardPage: FC = () => {
  const { setView } = useView();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your learning progress and available activities.</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.studentMfeStatsGrid}>
        <div className={styles.studentMfeStatCard}>
          <div className={`${styles.studentMfeStatIcon} ${styles.studentMfeStatIconBlue}`}>
            <span>📝</span>
          </div>
          <div className={styles.studentMfeStatContent}>
            <p className={styles.studentMfeStatLabel}>Available Quizzes</p>
            <p className={styles.studentMfeStatValue}>12</p>
          </div>
        </div>

        <div className={styles.studentMfeStatCard}>
          <div className={`${styles.studentMfeStatIcon} ${styles.studentMfeStatIconGreen}`}>
            <span>✅</span>
          </div>
          <div className={styles.studentMfeStatContent}>
            <p className={styles.studentMfeStatLabel}>Completed</p>
            <p className={styles.studentMfeStatValue}>8</p>
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

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setView('quizzes')}
            className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <span className="text-2xl mr-3">🔍</span>
            <span className="font-medium text-blue-700">Browse Quizzes</span>
          </button>
          
          <button 
            onClick={() => setView('history')}
            className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
          >
            <span className="text-2xl mr-3">📈</span>
            <span className="font-medium text-green-700">View History</span>
          </button>
          
          <button 
            onClick={() => setView('profile')}
            className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
          >
            <span className="text-2xl mr-3">👤</span>
            <span className="font-medium text-purple-700">Profile</span>
          </button>
          
          <button 
            onClick={() => setView('quizzes')}
            className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
          >
            <span className="text-2xl mr-3">🎯</span>
            <span className="font-medium text-orange-700">Start Quiz</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-medium text-gray-900">Completed JavaScript Fundamentals</p>
                <p className="text-sm text-gray-500">Score: 85% • 2 hours ago</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-600">Completed</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📚</span>
              <div>
                <p className="font-medium text-gray-900">Started React Hooks Deep Dive</p>
                <p className="text-sm text-gray-500">In Progress • 1 day ago</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-600">In Progress</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              <div>
                <p className="font-medium text-gray-900">New Quiz Available: CSS Grid</p>
                <p className="text-sm text-gray-500">Difficulty: Medium • 2 days ago</p>
              </div>
            </div>
            <span className="text-sm font-medium text-orange-600">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
