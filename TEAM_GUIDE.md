# 🚀 Quick Start Guide - Quiz Online System

## Dành cho Đồng đội phát triển Teacher MFE và Admin MFE

### 📋 Tổng quan nhanh

Hệ thống đã hoàn thành **Host Shell** và **Student MFE**. Đồng đội cần phát triển:
- **Teacher MFE** (port 5002) - Quản lý quiz cho giảng viên
- **Admin MFE** (port 5003) - Quản lý hệ thống cho admin

### 🛠 Setup Environment

```bash
# 1. Clone repository
git clone https://github.com/meiiie/quiz_online.git
cd quiz_online

# 2. Install dependencies
pnpm install

# 3. Start existing system
pnpm --filter student-mfe build && pnpm --filter student-mfe preview
pnpm --filter host-shell dev
```

### 🔐 Tài khoản test

| Role | Email | Password | Status |
|------|-------|----------|---------|
| Student | `student@test.com` | `123456` | ✅ Working |
| Teacher | `teacher@test.com` | `123456` | 🚧 Need MFE |
| Admin | `admin@test.com` | `123456` | 🚧 Need MFE |

### 🏗 Architecture hiện tại

```
┌─────────────────────────────────────────────────────────────┐
│                 HOST SHELL (Port 5173)                     │
│  Authentication + Routing + Module Federation               │
├─────────────────┬─────────────────┬─────────────────────────┤
│  STUDENT MFE    │  TEACHER MFE    │  ADMIN MFE              │
│  (Port 5001)    │  (Port 5002)    │  (Port 5003)            │
│  ✅ Complete    │  🚧 TODO        │  🚧 TODO                │
└─────────────────┴─────────────────┴─────────────────────────┘
```

### 📦 State Management Pattern

#### Zustand Store Template

```typescript
// stores/[role]Store.ts
import { create } from 'zustand';

interface [Role]State {
  // Data
  profile: [Role]Profile | null;
  data: [Role]Data[];
  isLoading: boolean;
  
  // Actions
  setProfile: (profile: [Role]Profile) => void;
  setData: (data: [Role]Data[]) => void;
  setLoading: (loading: boolean) => void;
}

export const use[Role]Store = create<[Role]State>((set) => ({
  profile: null,
  data: [],
  isLoading: false,
  setProfile: (profile) => set({ profile }),
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
```

### 🎨 UI Components Pattern

#### Tailwind CSS Classes được sử dụng

```css
/* Buttons */
.btn-primary: bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg
.btn-secondary: bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg

/* Cards */
.card: bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300

/* Layout */
.container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
.grid-responsive: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

### 🔧 Module Federation Setup

#### 1. Tạo Teacher MFE

```bash
# Tạo teacher-mfe
mkdir apps/teacher-mfe
cd apps/teacher-mfe
pnpm init
```

#### 2. Package.json Template

```json
{
  "name": "teacher-mfe",
  "scripts": {
    "dev": "vite --port 5002 --strictPort",
    "build": "tsc -b && vite build", 
    "preview": "vite preview --port 5002 --strictPort"
  },
  "dependencies": {
    "@originjs/vite-plugin-federation": "^1.4.1",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "zustand": "^5.0.7"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.12",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "tailwindcss": "^4.1.12",
    "typescript": "~5.8.3",
    "vite": "^7.1.2"
  }
}
```

#### 3. Vite Config Template

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'teacher_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './TeacherApp': './src/TeacherApp.tsx'
      },
      shared: ['react', 'react-dom']
    })
  ],
  server: { port: 5002, cors: true },
  preview: { port: 5002, cors: true },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});
```

#### 4. Update Host Shell

```typescript
// host-shell/vite.config.ts - Add remote
remotes: {
  student_mfe: 'http://localhost:5001/assets/remoteEntry.js',
  teacher_mfe: 'http://localhost:5002/assets/remoteEntry.js', // Add this
  admin_mfe: 'http://localhost:5003/assets/remoteEntry.js'    // Add this
}

// host-shell/src/routes/AppRoutes.tsx - Add route
const TeacherApp = lazy(() => import('teacher_mfe/TeacherApp'));

// Add protected route
<Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
  <Route path="/teacher/*" element={<TeacherApp />} />
</Route>
```

### 🚨 Troubleshooting Module Federation

#### 1. RemoteEntry.js 404 Error

```bash
# Always build MFE first, then preview
cd apps/teacher-mfe
pnpm build
pnpm preview

# In separate terminal
cd apps/host-shell  
pnpm dev
```

#### 2. CORS Issues

```typescript
// vite.config.ts
server: {
  cors: true,
  host: '0.0.0.0'  // Important for Windows
}
```

#### 3. Import Error Handling

```typescript
// Graceful fallback in AppRoutes.tsx
const TeacherApp = lazy(async () => {
  try {
    const module = await import('teacher_mfe/TeacherApp');
    return module;
  } catch (error) {
    return { 
      default: () => (
        <div className="p-4 text-center">
          <h2>Teacher MFE Loading Error</h2>
          <p>Please ensure teacher-mfe is running on port 5002</p>
        </div>
      ) 
    };
  }
});
```

### 📁 Folder Structure cho MFE mới

```
apps/teacher-mfe/
├── src/
│   ├── entities/          # Business logic (Quiz, Question, etc.)
│   ├── pages/            # Page components
│   │   ├── TeacherDashboard/
│   │   ├── QuizManagement/
│   │   └── StudentResults/
│   ├── shared/           # Shared utilities
│   │   ├── api/          # API services
│   │   └── ui/           # Reusable components
│   ├── store/            # Zustand stores
│   └── TeacherApp.tsx    # Main export for Module Federation
├── vite.config.ts
├── package.json
└── tailwind.config.js
```

### 🔄 Development Workflow

#### 1. Daily Development

```bash
# Terminal 1: Student MFE (already working)
cd apps/student-mfe && pnpm build && pnpm preview

# Terminal 2: Your MFE
cd apps/teacher-mfe && pnpm dev

# Terminal 3: Host Shell
cd apps/host-shell && pnpm dev
```

#### 2. Testing Integration

```bash
# Build your MFE for integration testing
cd apps/teacher-mfe
pnpm build
pnpm preview

# Test in host-shell
# Login with teacher@test.com / 123456
```

### 📋 TODO cho đồng đội

#### Teacher MFE Features

- [ ] Teacher Dashboard với statistics
- [ ] Quiz Creation Form
- [ ] Question Bank Management  
- [ ] Student Results Review
- [ ] Grade Analytics
- [ ] Export functionality

#### Admin MFE Features

- [ ] User Management (CRUD)
- [ ] System Configuration
- [ ] Reports Dashboard
- [ ] Content Moderation
- [ ] System Analytics

### 💡 Tips

1. **Copy từ Student MFE**: Sử dụng student-mfe làm template
2. **Zustand Pattern**: Follow pattern đã có trong student store
3. **Tailwind Classes**: Sử dụng classes đã có để consistency
4. **Error Handling**: Luôn có fallback cho loading errors
5. **Mobile First**: Design responsive từ đầu

### 🆘 Support

- **Code Reference**: `apps/student-mfe` làm mẫu
- **Architecture**: Xem `README.md` chính
- **Git**: Push thường xuyên, tạo feature branches
- **Issues**: Tạo GitHub issues khi gặp vấn đề

### 🎯 Next Steps

1. Clone repo và setup environment
2. Tạo Teacher MFE theo template trên
3. Test Module Federation integration
4. Implement core features
5. Add real API integration later

**Good luck! 🚀**
