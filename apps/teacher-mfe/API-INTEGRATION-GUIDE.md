# Teacher MFE - API Integration Architecture

## 📋 Overview

This document provides comprehensive documentation for the API integration architecture implemented in the Teacher MFE application. The system is designed for seamless backend integration while maintaining MSW (Mock Service Worker) compatibility for development.

## 🏗️ Architecture Components

### 1. **Core API Layer** (`src/api/`)

```
src/api/
├── endpoints.ts          # API endpoint constants
├── httpClient.ts         # HTTP client with interceptors  
├── services/             # Service layer for each domain
│   ├── authService.ts    # Authentication operations
│   ├── studentService.ts # Student management
│   ├── quizService.ts    # Quiz operations
│   ├── departmentService.ts # Department management
│   ├── analyticsService.ts  # Analytics & reporting
│   └── index.ts          # Barrel export
└── index.ts              # Main API export
```

### 2. **Type Definitions** (`src/types/index.ts`)

- **Complete TypeScript interfaces** for all API entities
- **Request/Response types** for all operations
- **Error handling classes** (ApiError)
- **Filter and pagination types**
- **Form validation interfaces**

### 3. **State Management** (`src/store/index.ts`)

- **Zustand stores** for each domain (Auth, Students, Quizzes, Departments)
- **Global app state** management
- **Reactive state updates** with API integration

### 4. **React Hooks** (`src/hooks/useApi.ts`)

- **Custom hooks** for API operations
- **Loading state management**
- **Error handling patterns**
- **Mutation hooks** for CRUD operations

## 🔌 Backend Integration Guide

### Environment Configuration

Create `.env` file in the Teacher MFE root:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_VERSION=v1

# Authentication
VITE_AUTH_TOKEN_KEY=auth_token

# Development Mode
VITE_MOCK_API=false  # Set to true for MSW mock mode
```

### API Endpoints Structure

The system expects the following REST API structure:

```
GET    /api/v1/auth/profile
POST   /api/v1/auth/login
POST   /api/v1/auth/logout

GET    /api/v1/students?page=1&limit=10&departmentId=...
GET    /api/v1/students/:id
POST   /api/v1/students
PUT    /api/v1/students/:id
DELETE /api/v1/students/:id

GET    /api/v1/quizzes?page=1&limit=10&status=active
GET    /api/v1/quizzes/:id
POST   /api/v1/quizzes
PUT    /api/v1/quizzes/:id
DELETE /api/v1/quizzes/:id

GET    /api/v1/departments
GET    /api/v1/departments/:id/students
GET    /api/v1/departments/:id/statistics

GET    /api/v1/analytics/dashboard
GET    /api/v1/analytics/departments
GET    /api/v1/analytics/student-progress
```

## 📊 Data Models

### Core Entities

**User Interface:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student' | 'admin';
  avatar?: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Student Interface:**
```typescript
interface Student {
  id: string;
  studentId: string;          // Student code (IT001, ECO002)
  name: string;
  email: string;
  avatar?: string;
  departmentId: string;
  department?: Department;     // Populated field
  classId?: string;
  enrollmentYear: number;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: string;
  updatedAt: string;
}
```

**Quiz Interface:**
```typescript
interface Quiz {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  teacherId: string;
  departmentId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;            // minutes
  passingScore: number;        // percentage
  maxAttempts: number;
  isRandomized: boolean;
  showResultsImmediately: boolean;
  status: 'draft' | 'active' | 'completed' | 'archived';
  availableFrom?: string;
  availableUntil?: string;
  createdAt: string;
  updatedAt: string;
  questions?: QuizQuestion[];
}
```

## 🛠️ Usage Examples

### 1. **Using API Services Directly**

```typescript
import { apiServices } from '../api';

// Get all students with pagination
const students = await apiServices.students.getStudents({
  page: 1,
  limit: 10,
  departmentId: 'dept-123'
});

// Create a new quiz
const newQuiz = await apiServices.quizzes.createQuiz({
  title: 'JavaScript Fundamentals',
  description: 'Basic JavaScript concepts',
  difficulty: 'medium',
  duration: 60,
  passingScore: 70,
  maxAttempts: 3,
  departmentId: 'dept-123',
  questions: []
});
```

### 2. **Using React Hooks**

```typescript
import { useStudents, useCreateStudent } from '../hooks/useApi';

function StudentList() {
  const { data, loading, error, refetch } = useStudents({ departmentId: 'dept-123' });
  const { mutate: createStudent, loading: creating } = useCreateStudent();

  const handleCreateStudent = async (studentData) => {
    const newStudent = await createStudent(studentData);
    if (newStudent) {
      refetch(); // Refresh the list
    }
  };

  if (loading === 'loading') return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.data?.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  );
}
```

### 3. **Using State Management**

```typescript
import { useStudentStore, useAuthStore } from '../store';

function StudentManagement() {
  const { 
    students, 
    loading, 
    addStudent, 
    updateStudent, 
    removeStudent 
  } = useStudentStore();
  
  const { user } = useAuthStore();

  // State is automatically synced with API calls
}
```

## 🔄 MSW Integration

The system maintains compatibility with MSW for development:

**Switch between modes:**
```typescript
// In main.tsx or App.tsx
if (import.meta.env.VITE_MOCK_API === 'true') {
  // Use MSW handlers (existing implementation)
  import('./mocks/browser').then(({ worker }) => {
    worker.start();
  });
}
```

**Existing MSW handlers remain functional** for development and testing.

## 🚨 Error Handling

### Global Error Management

```typescript
// ApiError class provides structured error information
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Automatic 401 handling (redirect to login)
// Network failure handling
// Retry mechanisms for failed requests
```

### Component-Level Error Handling

```typescript
const { data, loading, error } = useStudents();

if (error) {
  return (
    <div className="error-state">
      <h2>Error Loading Students</h2>
      <p>{error}</p>
      <button onClick={refetch}>Try Again</button>
    </div>
  );
}
```

## 📈 Performance Optimizations

1. **Request Deduplication** - Automatic deduplication of identical requests
2. **Caching Strategy** - Intelligent caching with invalidation
3. **Pagination Support** - Built-in pagination for large datasets
4. **Loading States** - Granular loading states for better UX
5. **Background Sync** - Retry failed requests when network recovers

## 🔐 Authentication Flow

```typescript
// 1. Login
const authResponse = await apiServices.auth.login({
  email: 'teacher@example.com',
  password: 'password'
});

// 2. Token automatically stored and attached to requests
httpClient.setToken(authResponse.token);

// 3. Auto-logout on 401 responses
// 4. Refresh token support for session extension
```

## 🧪 Testing Strategy

### Unit Testing API Services
```typescript
// Test API services with mocked HTTP client
jest.mock('../httpClient');

test('should fetch students successfully', async () => {
  const mockStudents = [{ id: '1', name: 'John Doe' }];
  httpClient.get.mockResolvedValue({ data: mockStudents });
  
  const result = await studentService.getStudents();
  expect(result.data).toEqual(mockStudents);
});
```

### Integration Testing with MSW
```typescript
// Use MSW handlers for integration tests
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 🚀 Deployment Considerations

### Backend Requirements

1. **CORS Configuration** - Allow requests from frontend domain
2. **Authentication** - JWT token-based authentication
3. **Rate Limiting** - Implement rate limiting for API endpoints
4. **Data Validation** - Server-side validation matching TypeScript interfaces
5. **Error Responses** - Consistent error response format

### Environment Variables

```env
# Production
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_API_VERSION=v1
VITE_MOCK_API=false

# Staging
VITE_API_BASE_URL=https://staging-api.yourdomain.com/api
VITE_MOCK_API=false

# Development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MOCK_API=true  # Use MSW for development
```

## 📋 Migration Checklist

- [ ] **Backend API endpoints** implemented matching the interface
- [ ] **Database schema** matches TypeScript interfaces
- [ ] **Authentication system** configured
- [ ] **CORS settings** properly configured
- [ ] **Environment variables** set for each environment
- [ ] **Error handling** implemented on backend
- [ ] **Testing** completed for all API endpoints
- [ ] **Performance testing** under load
- [ ] **Security review** completed

## 🤝 Contributing

When adding new API functionality:

1. **Add TypeScript interfaces** in `src/types/index.ts`
2. **Create service methods** in appropriate service file
3. **Add custom hooks** in `src/hooks/useApi.ts`
4. **Update MSW handlers** for development compatibility
5. **Add comprehensive tests**
6. **Update documentation**

---

This architecture provides a robust, scalable foundation for backend integration while maintaining development productivity with MSW support.
