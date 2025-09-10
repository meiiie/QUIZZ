# Host Shell - Authentication & Routing System

## 🎯 Tổng quan

Host Shell là ứng dụng chính trong kiến trúc micro-frontend, chịu trách nhiệm xác thực người dùng và điều hướng đến các MFE phù hợp với vai trò của họ.

## 🏗️ Kiến trúc

### Authentication Flow
```
LoginPage → AuthStore → AuthService → Role-based Redirect
    ↓           ↓           ↓              ↓
  UI Layer   State Mgmt   API Layer    Protected Routes
```

### Folder Structure
```
src/
├── components/         # Shared UI components
├── hooks/             
│   └── useAuthNavigation.ts  # Auth-aware navigation hook
├── layouts/           # Page layouts
├── pages/
│   ├── LoginPage.tsx         # Main login page
│   ├── student/              # Student-specific pages
│   ├── teacher/              # Teacher-specific pages
│   └── admin/                # Admin-specific pages
├── routes/
│   ├── AppRoutes.tsx         # Main routing config
│   └── ProtectedRoutes.tsx   # Role-based protection
├── services/
│   └── authService.ts        # API service layer
└── store/
    └── authStore.ts          # Global auth state
```

## 🔐 Authentication System

### 1. Auth Store (Zustand)
- **Persistent state**: Lưu trạng thái đăng nhập trong localStorage
- **Type safety**: Đầy đủ TypeScript types
- **Error handling**: Xử lý lỗi toàn diện
- **Loading states**: UI responsive

### 2. Auth Service Layer
- **Clean separation**: Tách biệt logic API khỏi UI
- **Error handling**: Custom AuthError class
- **Mock development**: Dễ dàng test trong development
- **Type safety**: Đầy đủ interface definitions

### 3. Protected Routes
- **Role-based access**: Phân quyền theo vai trò
- **Automatic redirect**: Tự động chuyển hướng
- **Loading states**: Hiển thị loading khi kiểm tra auth
- **Flexible permissions**: Dễ dàng cấu hình quyền truy cập

## 🚀 Cách sử dụng

### Đăng nhập với các vai trò khác nhau

#### Student Account
- Email: `student@test.com` hoặc `2024001234@student.vnu.edu.vn`
- Password: `123456`
- Redirect: `/student`

#### Teacher Account  
- Email: `teacher@test.com` hoặc `gv.nguyen@vnu.edu.vn`
- Password: `123456`
- Redirect: `/teacher`

#### Admin Account
- Email: `admin@test.com`
- Password: `123456` 
- Redirect: `/admin`

### Tích hợp với Micro-Frontends

```tsx
// Trong AppRoutes.tsx
<Route element={<StudentProtectedRoute />}>
  <Route path="/student/*" element={<StudentMFE />} />
</Route>

<Route element={<TeacherProtectedRoute />}>
  <Route path="/teacher/*" element={<TeacherMFE />} />
</Route>
```

### Sử dụng Auth Hooks

```tsx
import { useAuth, useAuthActions } from '@/store/authStore';
import { usePermissions } from '@/routes/ProtectedRoutes';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { login, logout } = useAuthActions();
  const { isStudent, canAccess } = usePermissions();
  
  // Component logic...
}
```

### Custom Navigation Hook

```tsx
import { useAuthNavigation } from '@/hooks/useAuthNavigation';

function MyPage() {
  const { canAccess, redirectToRole } = useAuthNavigation({
    requireAuth: true,
    allowedRoles: ['student', 'teacher']
  });

  if (!canAccess) {
    return <div>Loading...</div>;
  }

  // Page content...
}
```

## 🛠️ Development

### Chạy development server
```bash
pnpm dev
```

### Build production
```bash
pnpm build
```

### Lint code
```bash
pnpm lint
```

## 🔧 Cấu hình

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/` → `src/`)
- Full type checking

## 🎨 Best Practices Implemented

### 1. Clean Architecture
- **Separation of Concerns**: UI, Business Logic, Data Layer tách biệt
- **Dependency Injection**: Service layer có thể swap dễ dàng
- **Error Boundaries**: Xử lý lỗi toàn diện

### 2. Type Safety
- **Full TypeScript**: 100% type coverage
- **Strict configuration**: Bắt lỗi compile time
- **Interface definitions**: Rõ ràng, dễ maintain

### 3. State Management
- **Zustand**: Lightweight, performant
- **Persistence**: Automatic localStorage sync
- **Devtools**: Debug-friendly

### 4. User Experience
- **Loading states**: Feedback cho mọi action
- **Error handling**: User-friendly error messages
- **Responsive design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation

### 5. Security
- **Token management**: Secure storage, auto-refresh
- **Route protection**: Role-based access control
- **XSS protection**: Sanitized inputs

## 🔄 Integration Roadmap

### Phase 1: ✅ Current
- Authentication system
- Role-based routing
- Protected routes
- Mock API integration

### Phase 2: 🚧 Next
- Real backend integration
- Student MFE integration
- Teacher MFE integration

### Phase 3: 📋 Future
- Admin MFE integration
- SSO integration
- Advanced permissions
- Audit logging

## 🐛 Debugging

### Common Issues

#### 1. Authentication Loop
```typescript
// Check if token is expired
const { token, refreshAuth } = useAuthStore();
if (token && isTokenExpired(token)) {
  await refreshAuth();
}
```

#### 2. Route Protection Not Working
```typescript
// Ensure ProtectedRoute is wrapping correctly
<Route element={<ProtectedRoute allowedRoles={['student']} />}>
  <Route path="/student/*" element={<StudentDashboard />} />
</Route>
```

#### 3. State Not Persisting
```typescript
// Check Zustand persist configuration
persist(
  // state definition
  {
    name: 'quiz-auth-storage',
    storage: createJSONStorage(() => localStorage)
  }
)
```

## 📈 Performance

- **Bundle size**: Optimized with tree shaking
- **Code splitting**: Lazy loading for routes
- **Memory usage**: Efficient state management
- **Network**: Minimal API calls

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Add proper error handling
3. Include loading states
4. Write meaningful commit messages
5. Test authentication flows

---

**Developed with ❤️ for ĐHHH Vietnam Quiz System**
