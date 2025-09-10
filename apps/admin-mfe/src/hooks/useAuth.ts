// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import type { User } from '../features/user-management/UserManagement';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error("Failed to fetch current user", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { currentUser, isLoading };
};