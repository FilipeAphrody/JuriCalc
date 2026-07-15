import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  email: string;
  officeId?: number;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('vademath_token'),
  isAuthenticated: !!localStorage.getItem('vademath_token'),
  login: (user, token) => {
    localStorage.setItem('vademath_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('vademath_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
