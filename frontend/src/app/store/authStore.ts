import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  email: string;
  officeId?: number;
  role?: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Inicializar estado a partir do LocalStorage
const savedToken = localStorage.getItem('vademath_token');
const savedUser = localStorage.getItem('vademath_user');
let initialUser = null;

if (savedUser) {
  try {
    initialUser = JSON.parse(savedUser);
  } catch (e) {
    console.error("Failed to parse saved user");
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: savedToken,
  isAuthenticated: !!savedToken,
  login: (user, token) => {
    localStorage.setItem('vademath_token', token);
    localStorage.setItem('vademath_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('vademath_token');
    localStorage.removeItem('vademath_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
