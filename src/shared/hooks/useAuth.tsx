// Hook مخصص لإدارة المصادقة - قابل للاستخدام في Web/Mobile
'use client';
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { apiService, User, LoginCredentials, RegisterData } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // تحميل المستخدم عند بدء التطبيق
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          apiService.setToken(token);
          const response = await apiService.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('خطأ في تحميل المستخدم:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // حفظ التوكن
        localStorage.setItem('auth_token', token);
        apiService.setToken(token);
        
        // حفظ بيانات المستخدم
        setUser(userData);
        
        return true;
      } else {
        setError(response.error || 'فشل في تسجيل الدخول');
        return false;
      }
    } catch (error) {
      setError('خطأ في الاتصال');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.register(data);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        // حفظ التوكن
        localStorage.setItem('auth_token', token);
        apiService.setToken(token);
        
        // حفظ بيانات المستخدم
        setUser(userData);
        
        return true;
      } else {
        setError(response.error || 'فشل في إنشاء الحساب');
        return false;
      }
    } catch (error) {
      setError('خطأ في الاتصال');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    apiService.setToken(null);
    setUser(null);
    setError(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook للوصول لسياق المصادقة
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth يجب استخدامه داخل AuthProvider');
  }
  return context;
}
