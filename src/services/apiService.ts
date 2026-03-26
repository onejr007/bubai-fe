import { apiClient, API_ENDPOINTS } from '@/config/api';

// Example API Service
export class ExampleApiService {
  async getHello(): Promise<{ message: string; timestamp: string }> {
    return apiClient.get(API_ENDPOINTS.hello);
  }

  async getHelloByName(name: string): Promise<{ message: string; name: string }> {
    return apiClient.get(`${API_ENDPOINTS.hello}/${name}`);
  }
}

export const exampleApi = new ExampleApiService();

// Export all API services
export { adminAuthService } from './adminAuthService';
export { hpCamSessionService } from './hpCamSessionService';

// Re-export types
export type { AdminLoginResponse, AdminProfile } from './adminAuthService';
export type { 
  CreateSessionResponse, 
  JoinSessionResponse, 
  SessionStatus,
  WebRTCSignal,
  SignalsResponse 
} from './hpCamSessionService';
