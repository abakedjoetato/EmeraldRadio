import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  profileImage?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  role: 'admin' | 'manager' | 'user';
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      }),
      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      }),
      setLoading: (loading) => set({ isLoading: loading }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      }))
    }),
    {
      name: 'emerald-auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
    }
  )
);
