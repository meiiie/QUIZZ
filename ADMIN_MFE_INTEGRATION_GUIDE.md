# Hướng Dẫn Kết Nối Admin MFE với Host Shell

## 🎯 **Tổng Quan**

Đã hoàn thành việc kết nối admin-mfe với host-shell để có thể sử dụng tài khoản đăng nhập vào admin.

## 🔧 **Các Thay Đổi Đã Thực Hiện**

### **1. Admin MFE Configuration**
- ✅ Thêm `@originjs/vite-plugin-federation` dependency
- ✅ Cấu hình Module Federation trong `vite.config.ts`
- ✅ Expose `./AdminApp` component
- ✅ Cấu hình port 5002 cho admin-mfe
- ✅ Thêm script `start-mf` cho production build

### **2. Host Shell Configuration**
- ✅ Thêm admin_mfe remote trong `vite.config.ts`
- ✅ Cấu hình URL: `http://localhost:5002/assets/remoteEntry.js`
- ✅ Thêm `react-router-dom` vào shared dependencies
- ✅ Thêm lazy loading cho AdminApp
- ✅ Thêm admin routes với role protection

### **3. Authentication & Routing**
- ✅ Admin routes được bảo vệ bởi role 'admin'
- ✅ LoginPage đã hỗ trợ đăng nhập admin
- ✅ AuthStore đã hỗ trợ role 'admin'

## 🚀 **Cách Chạy và Test**

### **Bước 1: Cài đặt dependencies**
```bash
# Cài đặt dependencies cho admin-mfe
cd apps/admin-mfe
pnpm install

# Cài đặt dependencies cho host-shell
cd ../host-shell
pnpm install
```

### **Bước 2: Chạy các ứng dụng**

**Terminal 1 - Admin MFE:**
```bash
cd apps/admin-mfe
pnpm run start-mf
# Hoặc cho development (nếu có vấn đề với remoteEntry.js):
# pnpm run dev
```

**Terminal 2 - Student MFE:**
```bash
cd apps/student-mfe
pnpm run start-mf
```

**Terminal 3 - Host Shell:**
```bash
cd apps/host-shell
pnpm run dev
```

### **Bước 3: Test đăng nhập Admin**

1. Truy cập: `http://localhost:5173/login`
2. Đăng nhập với:
   - **Email**: `admin@test.com`
   - **Password**: `123456`
3. Sau khi đăng nhập thành công, sẽ được chuyển đến `/admin`
4. Admin MFE sẽ được load và hiển thị dashboard

### **Bước 4: Test Navigation**

- **Student**: `http://localhost:5173/student` (cần đăng nhập với `student@test.com`)
- **Admin**: `http://localhost:5173/admin` (cần đăng nhập với `admin@test.com`)

## 🔍 **Kiểm Tra Kết Nối**

### **1. Kiểm tra Module Federation**
- Mở Developer Tools → Network tab
- Tìm request đến `remoteEntry.js` từ port 5002
- Kiểm tra response có chứa admin module

### **2. Kiểm tra CSS Loading**
- Kiểm tra xem CSS của admin-mfe có load đúng không
- Kiểm tra xem có xung đột CSS giữa host và admin không

### **3. Kiểm tra Error Handling**
- Thử tắt admin-mfe và truy cập `/admin`
- Kiểm tra xem có hiển thị error message không

## ⚠️ **Lưu Ý Quan Trọng**

### **1. Vấn đề remoteEntry.js**
- Nếu gặp lỗi "Cannot resolve remoteEntry.js" trong dev mode
- Sử dụng `pnpm run start-mf` thay vì `pnpm run dev`
- Đây là vấn đề đã được phân tích trong tài liệu kỹ thuật

### **2. CSS Conflicts**
- Admin MFE và Host Shell đều dùng Tailwind CSS
- Có thể xảy ra xung đột CSS classes
- Cần triển khai CSS isolation trong tương lai

### **3. Port Configuration**
- Admin MFE: Port 5002
- Student MFE: Port 5001  
- Host Shell: Port 5173
- Đảm bảo không có xung đột port

## 🎉 **Kết Quả Mong Đợi**

Sau khi hoàn thành, bạn sẽ có:

1. **Admin Dashboard** hoạt động trong host shell
2. **Role-based routing** - chỉ admin mới truy cập được
3. **Module Federation** - admin-mfe load động từ remote
4. **Error handling** - hiển thị lỗi khi không load được
5. **Consistent UI** - admin MFE tích hợp mượt mà với host

## 🔄 **Next Steps**

1. **Cải thiện CSS isolation** - triển khai CSS Modules hoặc Shadow DOM
2. **Cập nhật plugin federation** - chuyển sang `@module-federation/vite`
3. **Thêm error boundaries** - xử lý lỗi tốt hơn
4. **Testing** - thêm unit tests và integration tests

---

**Status**: ✅ Hoàn thành kết nối admin-mfe với host-shell
**Date**: $(date)
**Architecture**: Module Federation + Client-Side Composition
