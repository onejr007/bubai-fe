import { apiClient, API_ENDPOINTS } from '@/config/api';

// Types
export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  adminId: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  sessionToken: string;
  expiresAt: string;
}

export interface AdminProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  lastLoginAt?: string;
}

// Admin Auth Service
export class AdminAuthService {
  private readonly TOKEN_KEY = 'admin_session_token';

  async login(username: string, password: string): Promise<AdminLoginResponse> {
    const response = await apiClient.post<AdminLoginResponse>(
      API_ENDPOINTS.adminLogin,
      { username, password }
    );
    
    // Store token in localStorage
    this.setToken(response.sessionToken);
    
    return response;
  }

  async logout(): Promise<void> {
    const token = this.getToken();
    
    if (token) {
      try {
        await apiClient.post(API_ENDPOINTS.adminLogout, { sessionToken: token });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.removeToken();
  }

  async validateSession(): Promise<AdminProfile | null> {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }

    try {
      const profile = await apiClient.post<AdminProfile>(
        API_ENDPOINTS.adminValidate,
        { sessionToken: token }
      );
      
      return profile;
    } catch (error) {
      this.removeToken();
      return null;
    }
  }

  async getProfile(): Promise<AdminProfile> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No session token');
    }

    // Use custom fetch with Authorization header
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${API_ENDPOINTS.adminProfile}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const adminAuthService = new AdminAuthService();
