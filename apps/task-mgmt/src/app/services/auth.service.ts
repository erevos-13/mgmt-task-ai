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

  async register(userData: LoginCredentials): Promise<void> {
    await axios.post('/user/signup', userData);
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await axios.get<User>('/auth/me');
    return data;
  },

  async logout(): Promise<void> {
    await axios.post('/auth/logout');
  },

  async updateProfile(data: FormData): Promise<User> {
    const { data: updatedUser } = await axios.patch<User>(
      '/api/v1/user/profile',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return updatedUser;
  },
};
