import { http, HttpResponse } from "msw";

// ============= MOCK DATA =============
const mockDashboard = {
  totalStudents: 145,
  activeQuizzes: 8,
  completedQuizzes: 12,
  averageScore: 78.5,
  recentActivity: [
    { id: 1, student: "Nguyễn Văn A", quiz: "Math Basics", score: 85, date: "2024-12-20" },
    { id: 2, student: "Trần Thị Mai", quiz: "Physics", score: 92, date: "2024-12-19" }
  ]
};

const mockStudents = [
  { id: 1, name: "Nguyễn Văn A", email: "a@student.edu", class: "10A1", completedQuizzes: 5, averageScore: 85 },
  { id: 2, name: "Trần Thị B", email: "b@student.edu", class: "10A1", completedQuizzes: 6, averageScore: 92 },
  { id: 3, name: "Lê Văn C", email: "c@student.edu", class: "10A2", completedQuizzes: 4, averageScore: 78 }
];

const mockQuizzes = [
  { id: 1, title: "Math Basics", difficulty: "easy", questions: 10, completed: 25, status: "active" },
  { id: 2, title: "Physics Midterm", difficulty: "medium", questions: 20, completed: 18, status: "active" },
  { id: 3, title: "Chemistry Quiz", difficulty: "hard", questions: 15, completed: 12, status: "draft" }
];

const mockClasses = [
  { id: 1, name: "10A1", students: 32, subject: "Lập trình mạng" },
  { id: 2, name: "10A2", students: 28, subject: "Vật lý" }
];

const mockDepartments = [
  { id: 1, name: 'Khoa Hàng hải', teachers: 15, students: 245 },
  { id: 2, name: 'Khoa Máy tàu biển', teachers: 12, students: 198 },
  { id: 3, name: 'Khoa Công trình thủy', teachers: 10, students: 167 },
  { id: 4, name: 'Khoa Điện - Điện tử tàu biển', teachers: 8, students: 134 },
  { id: 5, name: 'Khoa Kinh tế', teachers: 14, students: 156 },
  { id: 6, name: 'Khoa Khoa học - Tài chính', teachers: 7, students: 89 },
  { id: 7, name: 'Khoa Công nghệ thông tin', teachers: 11, students: 123 },
  { id: 8, name: 'Khoa Đóng tàu', teachers: 6, students: 78 },
  { id: 9, name: 'Khoa Ngoại ngữ', teachers: 9, students: 95 },
  { id: 10, name: 'Viện Môi trường', teachers: 8, students: 112 },
  { id: 11, name: 'Viện Đào tạo quốc tế', teachers: 5, students: 87 }
];

const mockGradingOverview = {
  totalAssignments: 25,
  pendingGrading: 8,
  avgGradingTime: 2.5,
  recentlyGraded: [
    { student: "Nguyễn Văn A", assignment: "Math Quiz 1", score: 85, gradedAt: "2024-12-20" },
    { student: "Trần Thị B", assignment: "Physics Test", score: 92, gradedAt: "2024-12-19" }
  ]
};

// ============= MSW HANDLERS =============
export const handlers = [
  // Dashboard - CHÍNH XÁC URL
  http.get("http://localhost:5176/api/v1/teacher/dashboard", () => {
    console.log('📊 Dashboard API called');
    return HttpResponse.json(mockDashboard);
  }),

  // Students - CHÍNH XÁC URL
  http.get("http://localhost:5176/api/v1/teacher/students", () => {
    console.log('👥 Students API called');
    return HttpResponse.json(mockStudents);
  }),

  // Quizzes - CHÍNH XÁC URL
  http.get("http://localhost:5176/api/v1/teacher/quizzes", () => {
    console.log('📝 Quizzes API called');
    return HttpResponse.json(mockQuizzes);
  }),

  // Classes - CHÍNH XÁC URL
  http.get("http://localhost:5176/api/v1/teacher/classes", () => {
    console.log('🏫 Classes API called');
    return HttpResponse.json(mockClasses);
  }),

  // Departments - CHÍNH XÁC URL với query parameters
  http.get("http://localhost:5176/api/v1/teacher/departments", ({ request }: any) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';
    
    console.log('🏢 Departments API called with:', { page, limit });
    
    return HttpResponse.json({
      data: mockDepartments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: mockDepartments.length,
        totalPages: 1
      }
    });
  }),

  // Grading Overview - CHÍNH XÁC URL
  http.get("http://localhost:5176/api/v1/teacher/grading/overview", ({ request }: any) => {
    console.log('📊 Grading Overview API called from URL:', request.url);
    return HttpResponse.json(mockGradingOverview);
  }),

  // Auth
  http.post("http://localhost:5176/api/v1/teacher/auth/login", () => {
    return HttpResponse.json({
      token: "mock-jwt-token",
      user: { id: 1, name: "Teacher Name", email: "teacher@school.edu" }
    });
  }),

  http.get("http://localhost:5176/api/v1/teacher/auth/profile", () => {
    return HttpResponse.json({
      id: 1,
      name: "Teacher Name",
      email: "teacher@school.edu",
      department: "Mathematics"
    });
  })
];
