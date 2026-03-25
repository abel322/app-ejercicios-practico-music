import axios from 'axios';
import type {
  LoginFormData,
  RegisterFormData,
  AuthResponse,
  ForgotPasswordData,
} from '../types/auth.types';
import { enqueueOperation } from '../utils/offlineQueue';

// Configurar baseURL de axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response para manejo de errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores de red (offline)
    if (!error.response && !navigator.onLine) {
      // Si es una operación de escritura (POST, PUT, DELETE), encolarla
      const config = error.config;
      if (config && ['post', 'put', 'delete'].includes(config.method?.toLowerCase() || '')) {
        const method = config.method?.toUpperCase() as 'POST' | 'PUT' | 'DELETE';
        const url = config.url || '';
        const data = config.data ? JSON.parse(config.data) : undefined;
        
        // No encolar operaciones de autenticación
        if (!url.includes('/auth/')) {
          enqueueOperation(method, url, data);
          
          // Retornar un error específico para operaciones encoladas
          const queuedError = new Error('Sin conexión. La operación se sincronizará cuando recuperes la conexión.');
          (queuedError as any).isQueued = true;
          return Promise.reject(queuedError);
        }
      }
      
      const networkError = new Error('Error de conexión. Verifica tu conexión a internet.');
      return Promise.reject(networkError);
    }

    // Manejar errores de red (otros casos)
    if (!error.response) {
      const networkError = new Error('Error de conexión. Verifica tu conexión a internet.');
      return Promise.reject(networkError);
    }

    // Manejar errores 401 (no autorizado)
    if (error.response.status === 401) {
      // Limpiar token y redirigir a login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Solo redirigir si no estamos ya en login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Manejar errores 403 (prohibido)
    if (error.response.status === 403) {
      // Si el error es de token, limpiar y redirigir
      const errorMsg = error.response?.data?.error || '';
      if (errorMsg.includes('Token') || errorMsg.includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        const tokenError = new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return Promise.reject(tokenError);
      }
      
      const forbiddenError = new Error(errorMsg || 'No tienes permisos para realizar esta acción.');
      return Promise.reject(forbiddenError);
    }

    // Manejar errores 404 (no encontrado)
    if (error.response.status === 404) {
      const notFoundError = new Error('Recurso no encontrado.');
      return Promise.reject(notFoundError);
    }

    // Manejar errores 500 (error del servidor)
    if (error.response.status >= 500) {
      // Intentar obtener el mensaje específico del servidor
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error del servidor. Por favor, intenta más tarde.';
      const serverError = new Error(errorMessage);
      return Promise.reject(serverError);
    }

    // Para otros errores, usar el mensaje del servidor si está disponible
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

export const authService = {
  /**
   * Login user
   */
  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  },

  /**
   * Register new user
   */
  async register(data: Omit<RegisterFormData, 'confirmPassword'>): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/api/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrar usuario');
    }
  },

  /**
   * Logout user (client-side only)
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/api/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al solicitar recuperación de contraseña');
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/api/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al restablecer contraseña');
    }
  },
};

export default api;
