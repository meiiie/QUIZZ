/**
 * User Entity Types
 * Business domain entities for user/student functionality
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfile extends User {
  role: 'student';
  studentId: string;
  grade?: string;
  school?: string;
  preferences: StudentPreferences;
  stats: StudentStats;
}

export interface StudentPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    quiz: boolean;
    results: boolean;
  };
  timezone: string;
}

export interface StudentStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  favoriteCategories: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'quiz' | 'score' | 'streak' | 'time';
}
