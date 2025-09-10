# Sơ Đồ Kiến Trúc Module Federation

## 🏗 Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                      │
│                        (Chỉ thấy localhost:5173)                              │
└─────────────────────────────┬───────────────────────────────────────────────────┘
                              │
                              │ HTTP Request
                              │ localhost:5173/student/dashboard
                              ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            HOST SHELL                                           │
│                         (Port 5173)                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Authentication & Routing Layer                      │   │
│  │  • React Router                                                       │   │
│  │  • Protected Routes                                                   │   │
│  │  • Role-based Access Control                                          │   │
│  │  • Main Layout (Header, Sidebar, Footer)                             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      Module Federation Layer                           │   │
│  │  • Dynamic Import Resolution                                           │   │
│  │  • Remote Module Loading                                               │   │
│  │  • Shared Dependencies Management                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                              │
                              │ Module Federation Calls
                              │ (Internal, không visible)
                              ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          MICRO FRONTENDS                                       │
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐            │
│  │  STUDENT MFE    │    │   ADMIN MFE     │    │  TEACHER MFE    │            │
│  │  Port 5001      │    │  Port 5002      │    │  Port 5003      │            │
│  │                 │    │                 │    │                 │            │
│  │ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │            │
│  │ │ remoteEntry │ │    │ │ remoteEntry │ │    │ │ remoteEntry │ │            │
│  │ │    .js      │ │    │ │    .js      │ │    │ │    .js      │ │            │
│  │ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │            │
│  │                 │    │                 │    │                 │            │
│  │ • Dashboard     │    │ • User Mgmt     │    │ • Quiz Mgmt     │            │
│  │ • Take Quiz     │    │ • System Config │    │ • Grade Review  │            │
│  │ • View Results  │    │ • Reports       │    │ • Analytics     │            │
│  │ • Profile       │    │ • Settings      │    │ • Statistics    │            │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Quy Trình Kết Nối Chi Tiết

### **Bước 1: User Request**
```
User Browser
    │
    │ GET http://localhost:5173/student/dashboard
    │
    ▼
Host Shell (Port 5173)
    │
    │ 1. React Router phát hiện route /student/*
    │ 2. Trigger lazy loading: import('student_mfe/StudentApp')
    │
    ▼
Module Federation Resolution
    │
    │ 3. Resolve 'student_mfe' → 'http://localhost:5001/assets/remoteEntry.js'
    │ 4. Fetch remoteEntry.js từ Student MFE
    │
    ▼
Student MFE (Port 5001)
    │
    │ 5. Serve remoteEntry.js chứa StudentApp component
    │ 6. Return component code
    │
    ▼
Host Shell
    │
    │ 7. Load StudentApp component
    │ 8. Render trong StudentLayout
    │
    ▼
User Browser
    │
    │ 9. Hiển thị Student Dashboard
    │    (User không biết có port 5001)
```

## 🌐 URL Mapping

### **URLs mà User Thấy:**
```
http://localhost:5173/                    → Host Shell Home
http://localhost:5173/login               → Host Shell Login
http://localhost:5173/student/dashboard   → Student MFE (Port 5001)
http://localhost:5173/student/quizzes     → Student MFE (Port 5001)
http://localhost:5173/admin/users         → Admin MFE (Port 5002)
http://localhost:5173/admin/settings      → Admin MFE (Port 5002)
```

### **URLs Thực Tế (Internal):**
```
http://localhost:5001/assets/remoteEntry.js  → Student MFE Entry Point
http://localhost:5002/assets/remoteEntry.js  → Admin MFE Entry Point
http://localhost:5003/assets/remoteEntry.js  → Teacher MFE Entry Point
```

## 🔧 Cấu Hình Module Federation

### **Host Shell Configuration:**
```typescript
// apps/host-shell/vite.config.ts
federation({
  name: 'host_shell',
  remotes: {
    student_mfe: 'http://localhost:5001/assets/remoteEntry.js',
    admin_mfe: 'http://localhost:5002/assets/remoteEntry.js'
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    'react-router-dom': { singleton: true }
  }
})
```

### **Student MFE Configuration:**
```typescript
// apps/student-mfe/vite.config.ts
federation({
  name: 'student_mfe',
  filename: 'remoteEntry.js',
  exposes: {
    './StudentApp': './src/App.tsx'
  },
  shared: ['react', 'react-dom']
})
```

## 📊 Data Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │    │ Host Shell  │    │ Student MFE │
│             │    │             │    │             │
│ 1. Request  │───▶│ 2. Route    │───▶│ 3. Serve    │
│    /student │    │    Match    │    │    remote   │
│             │    │             │    │    Entry    │
│             │    │             │    │             │
│ 4. Render   │◀───│ 5. Load     │◀───│ 6. Return   │
│    UI       │    │    Module   │    │    Component│
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🎯 Tại Sao Có Thể Dùng Port Host?

### **1. Proxy Pattern:**
- Host Shell làm **proxy** cho tất cả MFE
- User chỉ tương tác với Host Shell
- Host Shell quyết định load MFE nào

### **2. Client-Side Integration:**
- MFE được load **dynamically** trong browser
- Không cần server-side routing
- React Router xử lý tất cả navigation

### **3. Module Federation Magic:**
- `@originjs/vite-plugin-federation` tự động:
  - Tạo `remoteEntry.js` cho mỗi MFE
  - Resolve remote imports
  - Cache modules

## 🚀 Lợi Ích

### **Cho Developer:**
- ✅ Develop MFE độc lập
- ✅ Deploy riêng biệt
- ✅ Technology stack khác nhau
- ✅ Team autonomy

### **Cho User:**
- ✅ Single URL entry point
- ✅ Seamless navigation
- ✅ Consistent UI/UX
- ✅ Fast loading

### **Cho System:**
- ✅ Scalable architecture
- ✅ Independent scaling
- ✅ Fault isolation
- ✅ Technology diversity
