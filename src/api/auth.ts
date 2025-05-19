import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  logout: async (): Promise<void> => {
    await fetch('/api/auth/revoke-token', {
      method: 'POST',
      credentials: 'include',
    });
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  },
};
