// src/mocks/db.ts
import { User } from '../features/user-management/UserManagement';

// Dữ liệu người dùng ban đầu, có thể thay đổi được
export let mockUsers: User[] = [
  { id: 1, name: 'Nguyễn Văn Admin', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15', lastLogin: '2024-08-18' },
  { id: 2, name: 'Trần Thị Admin 2', email: 'admin2@example.com', role: 'student', status: 'active', createdAt: '2024-02-10', lastLogin: '2024-08-17' },
  { id: 3, name: 'Lê Văn Admin 3', email: 'admin3@example.com', role: 'admin', status: 'active', createdAt: '2024-03-05', lastLogin: '2024-08-16' },
  { id: 4, name: 'Phạm Thị Admin 4', email: 'admin4@example.com', role: 'admin', status: 'inactive', createdAt: '2024-01-20', lastLogin: '2024-07-15' },
  { id: 5, name: 'Hoàng Văn Admin 5', email: 'admin5@example.com', role: 'admin', status: 'active', createdAt: '2024-04-12', lastLogin: '2024-08-18' },
];

// Giả lập người dùng đang đăng nhập - chỉ admin mới có quyền truy cập
export const loggedInUser: User = mockUsers[0]; // Admin đang đăng nhập