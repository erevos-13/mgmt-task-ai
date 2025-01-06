import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../models/user';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setIsLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        try {
          set({ isLoading: true });
          const response = await authService.login({ email, password });
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          });
        } catch (error) {
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await authService.logout();
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateProfile: async (userData) => {
        try {
          set({ isLoading: true });
          // TODO: Add API call to update profile
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            set({ user: updatedUser });
          }
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
