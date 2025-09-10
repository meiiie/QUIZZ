// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { mockUsers, loggedInUser } from './db';

const API_BASE = '/api';

export const handlers = [
  // Bypass static assets and external fonts by returning passthrough via empty handler
  http.get('/favicon.ico', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // 1. Endpoint lấy thông tin người dùng đang đăng nhập (phục vụ phân quyền)
  http.get(`${API_BASE}/auth/me`, () => {
    return HttpResponse.json(loggedInUser);
  }),

  // 2. Endpoint lấy danh sách tất cả người dùng
  http.get(`${API_BASE}/users`, () => {
    return HttpResponse.json(mockUsers);
  }),

  // 3. Endpoint xóa một người dùng
  http.delete(`${API_BASE}/users/:userId`, ({ params }) => {
    const { userId } = params;
    const userIndex = mockUsers.findIndex(user => user.id === Number(userId));

    if (userIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    // Không cho phép xóa chính mình
    if (mockUsers[userIndex].id === loggedInUser.id) {
        return HttpResponse.json({ message: "Không thể tự xóa chính mình." }, { status: 403 });
    }

    mockUsers.splice(userIndex, 1);
    return new HttpResponse(null, { status: 204 }); // 204 No Content là response thành công cho DELETE
  }),

  // 4. Endpoint cập nhật trạng thái người dùng (kích hoạt/ngừng hoạt động)
  http.patch(`${API_BASE}/users/:userId/toggle-status`, ({ params }) => {
    const { userId } = params;
    const user = mockUsers.find(user => user.id === Number(userId));

    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    
    // Không cho phép tự khóa tài khoản của mình
    if (user.id === loggedInUser.id) {
        return HttpResponse.json({ message: "Không thể tự thay đổi trạng thái của chính mình." }, { status: 403 });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    return HttpResponse.json(user);
  }),

  // 5. Endpoint thêm người dùng mới
  http.post(`${API_BASE}/users`, async ({ request }) => {
    const userData = await request.json() as Omit<typeof mockUsers[0], 'id' | 'createdAt' | 'lastLogin'> & { password?: string };
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = mockUsers.find(user => user.email === userData.email);
    if (existingUser) {
      return HttpResponse.json({ message: "Email đã tồn tại trong hệ thống." }, { status: 409 });
    }

    // Tạo user mới (loại bỏ password khỏi response)
    const { password, ...userWithoutPassword } = userData;
    const newUser = {
      ...userWithoutPassword,
      id: Math.max(...mockUsers.map(u => u.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: undefined
    };

    mockUsers.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // 6. Endpoint cập nhật thông tin người dùng
  http.put(`${API_BASE}/users/:userId`, async ({ params, request }) => {
    const { userId } = params;
    const userData = await request.json() as Partial<typeof mockUsers[0]>;
    const userIndex = mockUsers.findIndex(user => user.id === Number(userId));

    if (userIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    // Kiểm tra email trùng (nếu có thay đổi email)
    if (userData.email && userData.email !== mockUsers[userIndex].email) {
      const existingUser = mockUsers.find(user => user.email === userData.email && user.id !== Number(userId));
      if (existingUser) {
        return HttpResponse.json({ message: "Email đã tồn tại trong hệ thống." }, { status: 409 });
      }
    }

    // Cập nhật user
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return HttpResponse.json(mockUsers[userIndex]);
  }),
];