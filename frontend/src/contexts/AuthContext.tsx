import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { User, LoginFormData, RegisterFormData } from '../types/auth.types';
import { authService } from '../services/authService';
import api from '../services/authService';
import { processQueue, hasQueuedOperations } from '../utils/offlineQueue';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateProfile: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  // Cargar usuario al iniciar aplicación
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Procesar cola offline cuando se reconecta
  useEffect(() => {
    const handleOnline = async () => {
      if (hasQueuedOperations()) {
        console.log('🔄 Conexión restaurada, procesando cola offline...');
        
        try {
          const result = await processQueue(api);
          
          if (result.success > 0) {
            showNotification(
              `${result.success} operación(es) sincronizada(s) exitosamente`,
              'success'
            );
          }
          
          if (result.failed > 0) {
            showNotification(
              `${result.failed} operación(es) no pudieron sincronizarse`,
              'warning'
            );
          }
        } catch (error) {
          console.error('Error al procesar cola offline:', error);
        }
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [showNotification]);

  // Configurar interceptor de axios para agregar token
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config: any) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        // Manejar respuestas 401/403 y redirigir a login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Limpiar autenticación
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Redirigir a login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const login = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);
      setUser(response.user);
      setToken(response.token);
      
      // Persistir en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      // Validar que las contraseñas coincidan
      if (data.password !== data.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Omitir confirmPassword al enviar al backend
      const { confirmPassword, ...registerData } = data;
      const response = await authService.register(registerData);
      
      setUser(response.user);
      setToken(response.token);
      
      // Persistir en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
