import { create } from 'zustand';
import { User } from '../features/user-management/UserManagement';
import { usersApi, ApiError } from '../services/api';
import { generatePassword, defaultPasswordOptions } from '../utils/passwordGenerator';

interface UserState {
  // State
  users: User[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  selectedRole: string;
  selectedStatus: string;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  recentActivities: Array<{ id: number; type: 'create' | 'update' | 'delete' | 'toggle'; userId: number; userName: string; userEmail: string; timestamp: string }>;

  // Actions
  fetchUsers: () => Promise<void>;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'> & { password?: string }) => Promise<void>;
  updateUser: (id: number, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleUserStatus: (id: number) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setSelectedRole: (role: string) => void;
  setSelectedStatus: (status: string) => void;
  setCurrentPage: (page: number) => void;
  clearError: () => void;
  resetFilters: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  users: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedRole: 'all',
  selectedStatus: 'all',
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
  recentActivities: [],

  // Actions
  fetchUsers: async () => {
    const currentState = get();
    if (currentState.isLoading) return; // Prevent multiple simultaneous calls
    
    set({ isLoading: true, error: null });
    
    try {
      const users = await usersApi.getUsers();
      set({
        users,
        isLoading: false,
        error: null,
        totalUsers: users.length,
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Không thể tải danh sách người dùng';
      
      set({
        users: [],
        isLoading: false,
        error: errorMessage,
        totalUsers: 0,
      });
    }
  },

  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Generate password if not provided
      const password = userData.password || generatePassword(defaultPasswordOptions);
      
      const newUser = await usersApi.createUser({
        ...userData,
        password
      });
      
      set((state) => ({
        users: [...state.users, newUser],
        isLoading: false,
        error: null,
        totalUsers: state.totalUsers + 1,
        recentActivities: [
          {
            id: Date.now(),
            type: 'create' as const,
            userId: newUser.id,
            userName: newUser.name,
            userEmail: newUser.email,
            timestamp: new Date().toISOString(),
          },
          ...state.recentActivities,
        ].slice(0, 20),
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Không thể tạo người dùng mới';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedUser = await usersApi.updateUser(id, userData);
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? updatedUser : user
        ),
        isLoading: false,
        error: null,
        recentActivities: [
          {
            id: Date.now(),
            type: 'update' as const,
            userId: updatedUser.id,
            userName: updatedUser.name,
            userEmail: updatedUser.email,
            timestamp: new Date().toISOString(),
          },
          ...state.recentActivities,
        ].slice(0, 20),
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Không thể cập nhật người dùng';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await usersApi.deleteUser(id);
      set((state) => {
        const deletedUser = state.users.find(u => u.id === id);
        return ({
          users: state.users.filter(user => user.id !== id),
          isLoading: false,
          error: null,
          totalUsers: state.totalUsers - 1,
          recentActivities: deletedUser ? [
            {
              id: Date.now(),
              type: 'delete' as const,
              userId: deletedUser.id,
              userName: deletedUser.name,
              userEmail: deletedUser.email,
              timestamp: new Date().toISOString(),
            },
            ...state.recentActivities,
          ].slice(0, 20) : state.recentActivities,
        });
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Không thể xóa người dùng';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  toggleUserStatus: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedUser = await usersApi.toggleUserStatus(id);
      set((state) => ({
        users: state.users.map(user => 
          user.id === id ? updatedUser : user
        ),
        isLoading: false,
        error: null,
        recentActivities: [
          {
            id: Date.now(),
            type: 'toggle' as const,
            userId: updatedUser.id,
            userName: updatedUser.name,
            userEmail: updatedUser.email,
            timestamp: new Date().toISOString(),
          },
          ...state.recentActivities,
        ].slice(0, 20),
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Không thể thay đổi trạng thái người dùng';
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  searchUsers: async (query) => {
    if (!query.trim()) {
      get().fetchUsers();
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const users = await usersApi.searchUsers(query);
      set({
        users,
        isLoading: false,
        error: null,
        totalUsers: users.length,
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Không thể tìm kiếm người dùng';
      
      set({
        users: [],
        isLoading: false,
        error: errorMessage,
        totalUsers: 0,
      });
    }
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  setSelectedRole: (role) => {
    set({ selectedRole: role });
  },

  setSelectedStatus: (status) => {
    set({ selectedStatus: status });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  clearError: () => {
    set({ error: null });
  },

  resetFilters: () => {
    set({
      searchTerm: '',
      selectedRole: 'all',
      selectedStatus: 'all',
      currentPage: 1,
    });
  },
}));

// Selectors for better performance
export const useUsers = () => useUserStore((state) => state.users);
export const useUsersLoading = () => useUserStore((state) => state.isLoading);
export const useUsersError = () => useUserStore((state) => state.error);
export const useUserFilters = () => useUserStore((state) => ({
  searchTerm: state.searchTerm,
  selectedRole: state.selectedRole,
  selectedStatus: state.selectedStatus,
  currentPage: state.currentPage,
}));

// Computed selectors
export const useFilteredUsers = () => {
  return useUserStore((state) => {
    const { users, searchTerm, selectedRole, selectedStatus } = state;
    
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  });
};

export const useUserStats = () => {
  return useUserStore((state) => {
    const { users } = state;
    
    return {
      total: users.length,
      active: users.filter(user => user.status === 'active').length,
      inactive: users.filter(user => user.status === 'inactive').length,
      admins: users.filter(user => user.role === 'admin').length,
      teachers: users.filter(user => user.role === 'teacher').length,
      students: users.filter(user => user.role === 'student').length,
    };
  });
};
