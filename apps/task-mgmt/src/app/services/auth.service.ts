import axios from '../lib/axios';
import { User } from '../models/user';

interface LoginResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  confirmPassword: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>(
      '/user/signin',
      credentials
    );
    return data;
  },

  async register(userData: RegisterData): Promise<void> {
    await axios.post('/auth/register', userData);
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await axios.get<User>('/auth/me');
    return data;
  },

  async logout(): Promise<void> {
    await axios.post('/auth/logout');
  },
};
