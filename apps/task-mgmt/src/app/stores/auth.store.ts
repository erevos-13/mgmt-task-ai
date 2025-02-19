import { create } from 'zustand';
import { User } from '../models/user';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: FormData) => Promise<User>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({ user: response.user, isAuthenticated: true });
    } catch (error) {
      set({ error: 'Failed to login' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      set({ error: 'Failed to logout' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await authService.updateProfile(data);
      set({ user: updatedUser });
      return updatedUser;
    } catch (error) {
      set({ error: 'Failed to update profile' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
