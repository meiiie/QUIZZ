// ========================================================================
// FILE: src/api/services/studentService.ts
// PURPOSE: Student management API service methods for teachers
// DESCRIPTION: All student-related API operations from teacher perspective
// ========================================================================

import { httpClient } from '../httpClient';
import { ENDPOINTS } from '../endpoints';
import {
  Student,
  ApiResponse,
  PaginationParams,
} from '../../types';

export interface TeacherStudentFilters {
  classId?: string;
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'email' | 'performance' | 'lastActivity';
  sortOrder?: 'asc' | 'desc';
}

export class StudentService {
  async getStudents(
    params?: PaginationParams & TeacherStudentFilters
  ): Promise<ApiResponse<Student[]>> {
    return httpClient.get<ApiResponse<Student[]>>(
      ENDPOINTS.STUDENTS.LIST,
      params
    );
  }

  async getStudentById(id: string): Promise<Student> {
    return httpClient.get<Student>(
      ENDPOINTS.STUDENTS.GET_BY_ID(id)
    );
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    return httpClient.put<Student>(
      ENDPOINTS.STUDENTS.UPDATE(id),
      data
    );
  }

  async getStudentProgress(id: string): Promise<any> {
    return httpClient.get<any>(
      ENDPOINTS.STUDENTS.PROGRESS(id)
    );
  }

  async getStudentQuizAttempts(
    id: string,
    params?: PaginationParams
  ): Promise<ApiResponse<any[]>> {
    return httpClient.get<ApiResponse<any[]>>(
      ENDPOINTS.STUDENTS.QUIZ_ATTEMPTS(id),
      params
    );
  }

  async exportStudents(filters?: TeacherStudentFilters): Promise<Blob> {
    return httpClient.post<Blob>(
      ENDPOINTS.STUDENTS.EXPORT,
      { filters },
      { responseType: 'blob' }
    );
  }

  async importGrades(file: File, classId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('classId', classId);
    return httpClient.post<any>(
      ENDPOINTS.STUDENTS.IMPORT_GRADES,
      formData
    );
  }
}

export const studentService = new StudentService();
export default studentService;
