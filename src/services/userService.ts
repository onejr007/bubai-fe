import { apiClient, API_ENDPOINTS } from '@/config/api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

class UserService {
  async getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>(API_ENDPOINTS.users);
  }

  async getUserById(id: string): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.userById(id));
  }

  async createUser(input: CreateUserInput): Promise<User> {
    return apiClient.post<User>(API_ENDPOINTS.users, input);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    return apiClient.put<User>(API_ENDPOINTS.userById(id), input);
  }

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.userById(id));
  }
}

export const userService = new UserService();
