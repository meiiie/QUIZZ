// ========================================================================
// FILE: src/store/index.ts
// PURPOSE: State management setup for API integration
// DESCRIPTION: Zustand stores for managing application state
// ========================================================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  User,
  Student,
  Quiz,
  Department,
  LoadingState,
  ApiError,
} from '../types';

// ============= AUTH STORE =============
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: LoadingState;
  error: string | null;
  
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: LoadingState) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      token: localStorage.getItem('auth_token'),
      isAuthenticated: !!localStorage.getItem('auth_token'),
      loading: 'idle',
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        localStorage.setItem('auth_token', token);
        set({ token, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    { name: 'auth-store' }
  )
);

// ============= STUDENT STORE =============
interface StudentState {
  students: Student[];
  currentStudent: Student | null;
  loading: LoadingState;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  removeStudent: (id: string) => void;
  setCurrentStudent: (student: Student | null) => void;
  setLoading: (loading: LoadingState) => void;
  setError: (error: string | null) => void;
  setPagination: (page: number, size: number, total: number) => void;
  clearStudents: () => void;
}

export const useStudentStore = create<StudentState>()(
  devtools(
    (set, get) => ({
      students: [],
      currentStudent: null,
      loading: 'idle',
      error: null,
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,

      setStudents: (students) => set({ students }),
      addStudent: (student) => set({ students: [...get().students, student] }),
      updateStudent: (id, updatedStudent) =>
        set({
          students: get().students.map((student) =>
            student.id === id ? { ...student, ...updatedStudent } : student
          ),
        }),
      removeStudent: (id) =>
        set({
          students: get().students.filter((student) => student.id !== id),
        }),
      setCurrentStudent: (student) => set({ currentStudent: student }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setPagination: (page, size, total) =>
        set({ currentPage: page, pageSize: size, totalCount: total }),
      clearStudents: () => set({ students: [], currentStudent: null }),
    }),
    { name: 'student-store' }
  )
);

// ============= QUIZ STORE =============
interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  loading: LoadingState;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  
  setQuizzes: (quizzes: Quiz[]) => void;
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (id: string, quiz: Partial<Quiz>) => void;
  removeQuiz: (id: string) => void;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setLoading: (loading: LoadingState) => void;
  setError: (error: string | null) => void;
  setPagination: (page: number, size: number, total: number) => void;
  clearQuizzes: () => void;
}

export const useQuizStore = create<QuizState>()(
  devtools(
    (set, get) => ({
      quizzes: [],
      currentQuiz: null,
      loading: 'idle',
      error: null,
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,

      setQuizzes: (quizzes) => set({ quizzes }),
      addQuiz: (quiz) => set({ quizzes: [...get().quizzes, quiz] }),
      updateQuiz: (id, updatedQuiz) =>
        set({
          quizzes: get().quizzes.map((quiz) =>
            quiz.id === id ? { ...quiz, ...updatedQuiz } : quiz
          ),
        }),
      removeQuiz: (id) =>
        set({
          quizzes: get().quizzes.filter((quiz) => quiz.id !== id),
        }),
      setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setPagination: (page, size, total) =>
        set({ currentPage: page, pageSize: size, totalCount: total }),
      clearQuizzes: () => set({ quizzes: [], currentQuiz: null }),
    }),
    { name: 'quiz-store' }
  )
);

// ============= DEPARTMENT STORE =============
interface DepartmentState {
  departments: Department[];
  currentDepartment: Department | null;
  loading: LoadingState;
  error: string | null;
  
  setDepartments: (departments: Department[]) => void;
  addDepartment: (department: Department) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  removeDepartment: (id: string) => void;
  setCurrentDepartment: (department: Department | null) => void;
  setLoading: (loading: LoadingState) => void;
  setError: (error: string | null) => void;
  clearDepartments: () => void;
}

export const useDepartmentStore = create<DepartmentState>()(
  devtools(
    (set, get) => ({
      departments: [],
      currentDepartment: null,
      loading: 'idle',
      error: null,

      setDepartments: (departments) => set({ departments }),
      addDepartment: (department) =>
        set({ departments: [...get().departments, department] }),
      updateDepartment: (id, updatedDepartment) =>
        set({
          departments: get().departments.map((department) =>
            department.id === id ? { ...department, ...updatedDepartment } : department
          ),
        }),
      removeDepartment: (id) =>
        set({
          departments: get().departments.filter((department) => department.id !== id),
        }),
      setCurrentDepartment: (department) => set({ currentDepartment: department }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearDepartments: () => set({ departments: [], currentDepartment: null }),
    }),
    { name: 'department-store' }
  )
);

// ============= APP STORE =============
interface AppState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;
  
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      sidebarOpen: true,
      theme: 'light',
      notifications: [],

      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      addNotification: (notification) =>
        set({
          notifications: [
            ...get().notifications,
            {
              ...notification,
              id: Date.now().toString(),
              timestamp: new Date(),
            },
          ],
        }),
      removeNotification: (id) =>
        set({
          notifications: get().notifications.filter((n) => n.id !== id),
        }),
      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: 'app-store' }
  )
);

// ============= EXPORT COMBINED STORES =============
export const stores = {
  auth: useAuthStore,
  students: useStudentStore,
  quizzes: useQuizStore,
  departments: useDepartmentStore,
  app: useAppStore,
} as const;
