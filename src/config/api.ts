// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  appURL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  timeout: 30000,
};

// API Endpoints - New Backend Framework
export const API_ENDPOINTS = {
  // Health Check
  health: '/health',
  
  // Users Module (Couchbase)
  users: '/api/v1/users',
  userById: (id: string) => `/api/v1/users/${id}`,
  
  // Example Module (In-Memory)
  example: '/api/v1/example',
  exampleById: (id: string) => `/api/v1/example/${id}`,
  
  // Legacy endpoints (if still needed)
  hello: '/api/hello',
  adminLogin: '/api/auth/admin/login',
  adminLogout: '/api/auth/admin/logout',
  adminValidate: '/api/auth/admin/validate',
  adminProfile: '/api/auth/admin/profile',
  // HP Camera Session (New Backend)
  hpCamCreateSession: '/api/v1/hp-cam-session/create',
  hpCamJoinSession: '/api/v1/hp-cam-session/join',
  hpCamSessionStatus: (sessionId: string) => `/api/v1/hp-cam-session/${sessionId}/status`,
  hpCamSendSignal: '/api/v1/hp-cam-session/signal',
  hpCamGetSignals: (sessionId: string) => `/api/v1/hp-cam-session/signal/${sessionId}`,
  hpCamEndSession: '/api/v1/hp-cam-session/end',
};

// API Response Types
// New Backend Framework Response
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Legacy Response Format
export interface LegacyApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// API Client Helper
export class ApiClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || API_CONFIG.baseURL;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    
    // Handle new backend format
    if (result.status === 'error') {
      throw new Error(result.message || 'API Error');
    }

    return result.data as T;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    
    // Handle new backend format
    if (result.status === 'error') {
      throw new Error(result.message || 'API Error');
    }

    return result.data as T;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    
    // Handle new backend format
    if (result.status === 'error') {
      throw new Error(result.message || 'API Error');
    }

    return result.data as T;
  }

  async delete<T>(endpoint: string): Promise<T | void> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return;
    }

    const result: ApiResponse<T> = await response.json();
    
    // Handle new backend format
    if (result.status === 'error') {
      throw new Error(result.message || 'API Error');
    }

    return result.data as T;
  }
}

// Default API client instance
export const apiClient = new ApiClient();
