import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLogin, useLogout, useRefreshToken, useRegister } from '../api/auth/authApi';
import { LoginRequest, RegisterRequest, User } from '../types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const { data: refreshData, isLoading: isRefreshing } = useRefreshToken();

  useEffect(() => {
    if (refreshData?.success && refreshData.user) {
      setUser(refreshData.user);
    }
    if (!isRefreshing) {
      setLoading(false);
    }
  }, [refreshData, isRefreshing]);

  const login = async (data: LoginRequest) => {
    const response = await loginMutation.mutateAsync(data);
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error(response.message);
    }
  };

  const register = async (data: RegisterRequest) => {
    const response = await registerMutation.mutateAsync(data);
    if (response.success && response.user) {
      setUser(response.user);
    } else {
      throw new Error(response.message);
    }
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    register,
    logout,
    loading: loading || isRefreshing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
