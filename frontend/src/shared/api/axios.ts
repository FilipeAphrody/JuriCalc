import axios from 'axios';
import { useAuthStore } from '../../app/store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token e o Office ID
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const user = useAuthStore.getState().user;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (user?.officeId) {
    config.headers['X-Office-ID'] = user.officeId;
  }
  
  return config;
});

// Interceptor genérico de resposta (ex: deslogar em 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login'; // Force redirect to login
    }
    return Promise.reject(error);
  }
);
