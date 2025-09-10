// ========================================================================
// FILE: src/store/authStore.ts
// PURPOSE: Simple global authentication state for MFE architecture
// FEATURES: User session, role-based routing, localStorage persistence
// ========================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
    }
  )
);