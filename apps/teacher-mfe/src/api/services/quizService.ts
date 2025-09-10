// ========================================================================
// FILE: src/api/services/quizService.ts
// PURPOSE: Quiz management API service methods
// DESCRIPTION: All quiz-related API operations
// ========================================================================

import { httpClient } from '../httpClient';
import { ENDPOINTS } from '../endpoints';
import {
  Quiz,
  QuizQuestion,
  QuizAttempt,
  CreateQuizRequest,
  UpdateQuizRequest,
  ApiResponse,
  PaginationParams,
  QuizFilters,
} from '../../types';

export class QuizService {
  // ============= QUIZ CRUD OPERATIONS =============
  async getQuizzes(
    params?: PaginationParams & QuizFilters
  ): Promise<ApiResponse<Quiz[]>> {
    return httpClient.get<ApiResponse<Quiz[]>>(
      ENDPOINTS.QUIZZES.LIST,
      params
    );
  }

  async getQuizById(id: string): Promise<Quiz> {
    return httpClient.get<Quiz>(
      ENDPOINTS.QUIZZES.GET_BY_ID(id)
    );
  }

  async createQuiz(quizData: CreateQuizRequest): Promise<Quiz> {
    return httpClient.post<Quiz>(
      ENDPOINTS.QUIZZES.CREATE,
      quizData
    );
  }

  async updateQuiz(id: string, quizData: UpdateQuizRequest): Promise<Quiz> {
    return httpClient.put<Quiz>(
      ENDPOINTS.QUIZZES.UPDATE(id),
      quizData
    );
  }

  async deleteQuiz(id: string): Promise<void> {
    return httpClient.delete<void>(
      ENDPOINTS.QUIZZES.DELETE(id)
    );
  }

  // ============= QUIZ STATUS MANAGEMENT =============
  async publishQuiz(id: string): Promise<Quiz> {
    return httpClient.post<Quiz>(
      ENDPOINTS.QUIZZES.PUBLISH(id)
    );
  }

  async archiveQuiz(id: string): Promise<Quiz> {
    return httpClient.post<Quiz>(
      ENDPOINTS.QUIZZES.ARCHIVE(id)
    );
  }

  async duplicateQuiz(id: string, newTitle?: string): Promise<Quiz> {
    return httpClient.post<Quiz>(
      ENDPOINTS.QUIZZES.DUPLICATE(id),
      { newTitle }
    );
  }

  // ============= QUIZ QUESTIONS MANAGEMENT =============
  async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    return httpClient.get<QuizQuestion[]>(
      ENDPOINTS.QUIZZES.QUESTIONS(quizId)
    );
  }

  async addQuestionToQuiz(
    quizId: string,
    questionData: Omit<QuizQuestion, 'id' | 'quizId' | 'createdAt' | 'updatedAt'>
  ): Promise<QuizQuestion> {
    return httpClient.post<QuizQuestion>(
      ENDPOINTS.QUIZZES.ADD_QUESTION(quizId),
      questionData
    );
  }

  async updateQuizQuestion(
    quizId: string,
    questionId: string,
    questionData: Partial<QuizQuestion>
  ): Promise<QuizQuestion> {
    return httpClient.put<QuizQuestion>(
      ENDPOINTS.QUIZZES.UPDATE_QUESTION(quizId, questionId),
      questionData
    );
  }

  async deleteQuizQuestion(quizId: string, questionId: string): Promise<void> {
    return httpClient.delete<void>(
      ENDPOINTS.QUIZZES.DELETE_QUESTION(quizId, questionId)
    );
  }

  async reorderQuizQuestions(
    quizId: string,
    questionOrders: Array<{ id: string; order: number }>
  ): Promise<void> {
    return httpClient.post<void>(
      ENDPOINTS.QUIZZES.REORDER_QUESTIONS(quizId),
      { questionOrders }
    );
  }

  // ============= QUIZ ATTEMPTS & RESULTS =============
  async getQuizAttempts(
    quizId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<QuizAttempt[]>> {
    return httpClient.get<ApiResponse<QuizAttempt[]>>(
      ENDPOINTS.QUIZZES.ATTEMPTS(quizId),
      params
    );
  }

  async getQuizAttemptDetails(
    quizId: string,
    attemptId: string
  ): Promise<QuizAttempt> {
    return httpClient.get<QuizAttempt>(
      ENDPOINTS.QUIZZES.ATTEMPT_DETAILS(quizId, attemptId)
    );
  }

  async getQuizStatistics(quizId: string): Promise<{
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    averageTimeSpent: number;
    difficultyDistribution: {
      easy: number;
      medium: number;
      hard: number;
    };
    departmentStats: Array<{
      departmentId: string;
      departmentName: string;
      attempts: number;
      averageScore: number;
      passRate: number;
    }>;
    questionStats: Array<{
      questionId: string;
      questionText: string;
      correctAnswers: number;
      totalAnswers: number;
      accuracy: number;
    }>;
  }> {
    return httpClient.get<{
      totalAttempts: number;
      averageScore: number;
      passRate: number;
      averageTimeSpent: number;
      difficultyDistribution: {
        easy: number;
        medium: number;
        hard: number;
      };
      departmentStats: Array<{
        departmentId: string;
        departmentName: string;
        attempts: number;
        averageScore: number;
        passRate: number;
      }>;
      questionStats: Array<{
        questionId: string;
        questionText: string;
        correctAnswers: number;
        totalAnswers: number;
        accuracy: number;
      }>;
    }>(ENDPOINTS.QUIZZES.STATISTICS(quizId));
  }

  async exportQuizResults(quizId: string): Promise<Blob> {
    const response = await fetch(ENDPOINTS.QUIZZES.EXPORT_RESULTS(quizId), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${httpClient.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export quiz results');
    }

    return response.blob();
  }

  // ============= QUIZ GRADING (TEACHER SPECIFIC) =============
  async gradeQuizAttempt(
    quizId: string,
    attemptId: string,
    gradeData: {
      score: number;
      feedback?: string;
      questionGrades?: Array<{
        questionId: string;
        points: number;
        feedback?: string;
      }>;
    }
  ): Promise<any> {
    return httpClient.post(
      ENDPOINTS.QUIZZES.GRADE_ATTEMPT(quizId, attemptId),
      gradeData
    );
  }

  async bulkGradeQuiz(
    quizId: string,
    gradeData: Array<{
      attemptId: string;
      score: number;
      feedback?: string;
    }>
  ): Promise<void> {
    return httpClient.post<void>(
      ENDPOINTS.QUIZZES.BULK_GRADE(quizId),
      { grades: gradeData }
    );
  }

  // ============= SEARCH & FILTER OPERATIONS =============
  async searchQuizzes(query: string, departmentId?: string): Promise<Quiz[]> {
    return httpClient.get<Quiz[]>(ENDPOINTS.QUIZZES.LIST, {
      search: query,
      departmentId,
      page: 1,
      limit: 20,
    });
  }

  async getQuizzesByDepartment(
    departmentId: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Quiz[]>> {
    return this.getQuizzes({
      ...params,
      departmentId,
    });
  }

  async getQuizzesByStatus(
    status: 'draft' | 'active' | 'completed' | 'archived',
    params?: PaginationParams
  ): Promise<ApiResponse<Quiz[]>> {
    return this.getQuizzes({
      ...params,
      status,
    });
  }

  // ============= VALIDATION HELPERS =============
  async checkQuizTitleExists(title: string, excludeId?: string): Promise<boolean> {
    try {
      const response = await httpClient.get<{ exists: boolean }>(
        `${ENDPOINTS.QUIZZES.LIST}/check-title`,
        { title, excludeId }
      );
      return response.exists;
    } catch (error) {
      return false;
    }
  }

  // ============= QUIZ ASSIGNMENT INTEGRATION =============
  async assignQuizToStudents(quizId: string, studentIds: string[], settings: {
    startDate?: string;
    endDate?: string;
    maxAttempts?: number;
    showCorrectAnswers?: string;
    allowRetake?: boolean;
  }): Promise<void> {
    return httpClient.post<void>(
      ENDPOINTS.QUIZZES.ASSIGN(quizId),
      { studentIds, settings }
    );
  }

  async getQuizAssignments(quizId: string): Promise<Array<{
    id: string;
    studentId: string;
    studentName: string;
    status: 'assigned' | 'in-progress' | 'completed' | 'overdue';
    assignedAt: string;
    startedAt?: string;
    completedAt?: string;
    score?: number;
    attempts: number;
  }>> {
    return httpClient.get(
      ENDPOINTS.QUIZZES.ASSIGNMENTS(quizId)
    );
  }

  async unassignQuizFromStudents(quizId: string, studentIds: string[]): Promise<void> {
    return httpClient.post<void>(
      ENDPOINTS.QUIZZES.UNASSIGN(quizId),
      { studentIds }
    );
  }

  // ============= QUIZ TEMPLATES & CREATION HELPERS =============
  async getQuizTemplates(): Promise<Quiz[]> {
    return httpClient.get<Quiz[]>(
      ENDPOINTS.QUIZZES.TEMPLATES
    );
  }

  async createQuizFromTemplate(templateId: string, customData?: Partial<CreateQuizRequest>): Promise<Quiz> {
    return httpClient.post<Quiz>(
      ENDPOINTS.QUIZZES.CREATE_FROM_TEMPLATE(templateId),
      customData
    );
  }

  async validateQuizData(quizData: CreateQuizRequest): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    return httpClient.post(
      ENDPOINTS.QUIZZES.VALIDATE,
      quizData
    );
  }

  // ============= BULK QUIZ OPERATIONS =============
  async bulkUpdateQuizzes(quizIds: string[], updates: Partial<Quiz>): Promise<Quiz[]> {
    return httpClient.post<Quiz[]>(
      ENDPOINTS.QUIZZES.BULK_UPDATE,
      { quizIds, updates }
    );
  }

  async bulkDeleteQuizzes(quizIds: string[]): Promise<void> {
    return httpClient.post<void>(
      ENDPOINTS.QUIZZES.BULK_DELETE,
      { quizIds }
    );
  }

  async bulkAssignQuizzes(quizIds: string[], studentIds: string[], settings: any): Promise<void> {
    return httpClient.post<void>(
      ENDPOINTS.QUIZZES.BULK_ASSIGN,
      { quizIds, studentIds, settings }
    );
  }
}

// Singleton instance
export const quizService = new QuizService();
export default quizService;
