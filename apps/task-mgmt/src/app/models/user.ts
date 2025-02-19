export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  profileImage?: string;
  imagePublicId?: string;
  role: 'ADMIN' | 'MANAGER' | 'CONTRIBUTOR';
}

export interface RegisterData {
  email: string;
  password: string;
}
