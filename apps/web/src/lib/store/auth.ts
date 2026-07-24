import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@art-platform/shared-types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      
      login: (accessToken, refreshToken, user) => set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true
      }),
      
      logout: () => set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false
      }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      }))
    }),
    {
      name: 'auth-storage',
      // We persist tokens in local storage for the MVP.
      // In production, HTTP-only cookies are more secure.
    }
  )
);
