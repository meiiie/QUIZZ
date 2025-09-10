# Giải Thích Chi Tiết Module Federation trong Dự Án Quiz Online

## 🎯 Tổng Quan Kiến Trúc

Dự án Quiz Online sử dụng **Module Federation** để tạo ra một hệ thống **Micro Frontend (MFE)** với các ứng dụng độc lập có thể chạy riêng biệt nhưng được tích hợp thông qua Host Shell.

## 🏗 Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                    HOST SHELL (Port 5173)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Authentication & Routing               │   │
│  │  - Login/Logout                                    │   │
│  │  - Role-based Access Control                       │   │
│  │  - Main Navigation                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  STUDENT MFE    │  │   ADMIN MFE     │  │ TEACHER MFE │ │
│  │  (Port 5001)    │  │  (Port 5002)    │  │ (Port 5003) │ │
│  │                 │  │                 │  │             │ │
│  │ - Dashboard     │  │ - User Mgmt     │  │ - Quiz Mgmt │ │
│  │ - Take Quiz     │  │ - System Config │  │ - Grade     │ │
│  │ - View Results  │  │ - Reports       │  │ - Analytics │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Cách Module Federation Hoạt Động

### 1. **Cấu Hình Host Shell (apps/host-shell/vite.config.ts)**

```typescript
federation({
  name: 'host_shell',
  remotes: {
    student_mfe: 'http://localhost:5001/assets/remoteEntry.js',
    admin_mfe: 'http://localhost:5002/assets/remoteEntry.js'
  },
  shared: {
    react: { singleton: true, requiredVersion: false },
    'react-dom': { singleton: true, requiredVersion: false },
    'react-router-dom': { singleton: true, requiredVersion: false }
  }
})
```

**Giải thích:**
- `remotes`: Định nghĩa các MFE từ xa mà Host Shell có thể import
- `student_mfe`: URL đến file `remoteEntry.js` của Student MFE
- `admin_mfe`: URL đến file `remoteEntry.js` của Admin MFE
- `shared`: Các thư viện được chia sẻ giữa Host và Remote để tránh conflict

### 2. **Cấu Hình Student MFE (apps/student-mfe/vite.config.ts)**

```typescript
federation({
  name: 'student_mfe',
  filename: 'remoteEntry.js',
  exposes: {
    './StudentApp': './src/App.tsx'
  },
  shared: ['react', 'react-dom']
})
```

**Giải thích:**
- `filename`: Tên file entry point được tạo ra (`remoteEntry.js`)
- `exposes`: Các component/function được expose cho Host Shell sử dụng
- `'./StudentApp'`: Tên export (alias)
- `'./src/App.tsx'`: Đường dẫn đến component thực tế

### 3. **Cấu Hình Admin MFE (apps/admin-mfe/vite.config.ts)**

```typescript
federation({
  name: 'admin_mfe',
  filename: 'remoteEntry.js',
  exposes: {
    './AdminApp': './src/App.tsx'
  },
  shared: {
    react: { singleton: true, requiredVersion: false },
    'react-dom': { singleton: true, requiredVersion: false },
    'react-router-dom': { singleton: true, requiredVersion: false }
  }
})
```

## 🌐 Cách Tạo URL Sử Dụng Port Host Thay Vì Port Student

### **Vấn Đề:**
- Student MFE chạy trên port 5001
- Admin MFE chạy trên port 5002  
- Host Shell chạy trên port 5173
- Người dùng chỉ cần truy cập `localhost:5173` để sử dụng toàn bộ hệ thống

### **Giải Pháp:**

#### 1. **Dynamic Import trong Host Shell**

```typescript
// apps/host-shell/src/routes/AppRoutes.tsx
const StudentApp = lazy(async () => {
  try {
    const module = await import('student_mfe/StudentApp');
    return module;
  } catch (error) {
    console.error('Failed to load Student MFE:', error);
    return { 
      default: () => <div>Student MFE Loading Error</div>
    };
  }
});
```

**Cách hoạt động:**
- `import('student_mfe/StudentApp')` không phải là import thông thường
- Module Federation sẽ tự động resolve `student_mfe` thành `http://localhost:5001/assets/remoteEntry.js`
- Sau đó load component `StudentApp` từ remoteEntry.js

#### 2. **Routing trong Host Shell**

```typescript
<Route path="/student/*" element={
  <StudentLayout>
    <StudentApp />
  </StudentLayout>
} />
```

**Kết quả:**
- URL: `http://localhost:5173/student/dashboard`
- Host Shell xử lý routing `/student/*`
- Student MFE được load và render bên trong Host Shell
- Người dùng không bao giờ thấy port 5001 trong URL

## 🔄 Quy Trình Kết Nối Chi Tiết

### **Bước 1: Khởi Động Các Service**

```bash
# Terminal 1: Start Student MFE
cd apps/student-mfe
pnpm dev  # Chạy trên port 5001

# Terminal 2: Start Admin MFE  
cd apps/admin-mfe
pnpm dev  # Chạy trên port 5002

# Terminal 3: Start Host Shell
cd apps/host-shell
pnpm dev  # Chạy trên port 5173
```

### **Bước 2: Module Federation Resolution**

1. **Host Shell khởi động** và đọc config
2. **Tạo mapping** `student_mfe` → `http://localhost:5001/assets/remoteEntry.js`
3. **Student MFE build** và tạo file `remoteEntry.js` chứa:
   ```javascript
   // remoteEntry.js (được tạo tự động)
   var moduleMap = {
     "./StudentApp": () => import("./src/App.tsx")
   };
   ```

### **Bước 3: Dynamic Loading**

1. **User truy cập** `http://localhost:5173/student/dashboard`
2. **Host Shell routing** phát hiện route `/student/*`
3. **Lazy loading** trigger: `import('student_mfe/StudentApp')`
4. **Module Federation** fetch `http://localhost:5001/assets/remoteEntry.js`
5. **Load component** `StudentApp` từ Student MFE
6. **Render** component trong Host Shell layout

## 🎯 Tại Sao Có Thể Tạo URL Sử Dụng Port Host?

### **1. Proxy Pattern**
- Host Shell đóng vai trò **proxy** cho tất cả MFE
- Tất cả request đều đi qua Host Shell (port 5173)
- Host Shell quyết định load MFE nào dựa trên route

### **2. Client-Side Routing**
- React Router trong Host Shell xử lý routing
- MFE được load **dynamically** khi cần
- Không cần server-side routing phức tạp

### **3. Module Federation Magic**
- `@originjs/vite-plugin-federation` tự động:
  - Tạo `remoteEntry.js` cho mỗi MFE
  - Resolve remote imports thành HTTP requests
  - Cache modules để tối ưu performance

## 🔧 Cấu Hình Quan Trọng

### **1. CORS Configuration**
```typescript
// Tất cả MFE cần bật CORS
server: {
  port: 5001,
  cors: true,
  host: '0.0.0.0'  // Quan trọng cho Windows
}
```

### **2. Shared Dependencies**
```typescript
shared: {
  react: { singleton: true, requiredVersion: false },
  'react-dom': { singleton: true, requiredVersion: false }
}
```
**Tại sao quan trọng:**
- Tránh load nhiều version React
- Đảm bảo context sharing
- Tối ưu bundle size

### **3. Error Handling**
```typescript
const StudentApp = lazy(async () => {
  try {
    const module = await import('student_mfe/StudentApp');
    return module;
  } catch (error) {
    // Graceful fallback khi MFE không available
    return { default: () => <ErrorComponent /> };
  }
});
```

## 🚀 Lợi Ích Của Kiến Trúc Này

### **1. Development Independence**
- Mỗi team có thể develop MFE riêng biệt
- Deploy độc lập không ảnh hưởng MFE khác
- Technology stack có thể khác nhau

### **2. User Experience**
- Single URL entry point (`localhost:5173`)
- Seamless navigation giữa các MFE
- Consistent authentication và layout

### **3. Scalability**
- Dễ dàng thêm MFE mới
- Load balancing cho từng MFE
- Independent scaling

## 🛠 Troubleshooting

### **1. RemoteEntry.js 404 Error**
```bash
# Luôn build MFE trước khi start Host Shell
cd apps/student-mfe
pnpm build
pnpm preview

cd apps/host-shell  
pnpm dev
```

### **2. CORS Issues**
```typescript
// Đảm bảo tất cả MFE có CORS enabled
server: {
  cors: true,
  host: '0.0.0.0'
}
```

### **3. Module Loading Errors**
- Check network tab trong DevTools
- Verify remoteEntry.js accessible
- Check shared dependencies version

## 📊 Kết Luận

Module Federation cho phép:
- **Host Shell** (port 5173) làm entry point duy nhất
- **Student MFE** (port 5001) và **Admin MFE** (port 5002) chạy độc lập
- **Dynamic loading** MFE dựa trên routing
- **Seamless integration** mà user không biết có nhiều port

Đây là kiến trúc hiện đại cho **Micro Frontend** cho phép scale và maintain dễ dàng!
