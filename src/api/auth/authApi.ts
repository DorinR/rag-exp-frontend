import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';
import { backendAccessPoint } from '../backendAccessPoint';

/**
 * Registers a new user
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await backendAccessPoint.post<AuthResponse>('/api/auth/register', data, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Hook that uses TanStack Query's useMutation to handle user registration
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onError: error => {
      console.error('Error registering user:', error);
    },
  });
};

/**
 * Logs in a user
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await backendAccessPoint.post<AuthResponse>('/api/auth/login', data, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Hook that uses TanStack Query's useMutation to handle user login
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onError: error => {
      console.error('Error logging in:', error);
    },
  });
};

/**
 * Logs out the current user
 */
export const logout = async (): Promise<void> => {
  await backendAccessPoint.post('/api/auth/revoke-token', null, {
    withCredentials: true,
  });
};

/**
 * Hook that uses TanStack Query's useMutation to handle user logout
 */
export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onError: error => {
      console.error('Error logging out:', error);
    },
  });
};

/**
 * Refreshes the authentication token
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await backendAccessPoint.post<AuthResponse>('/api/auth/refresh-token', null, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Hook that uses TanStack Query to handle token refresh
 */
export const useRefreshToken = () => {
  return useQuery({
    queryKey: ['auth', 'refresh'],
    queryFn: refreshToken,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 1000 * 60 * 14, // Refresh every 14 minutes
    refetchIntervalInBackground: true,
    staleTime: 1000 * 60 * 15, // Consider data stale after 15 minutes
  });
};
