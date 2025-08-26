import axios, { AxiosResponse } from 'axios';
import { API_URL } from '@env';
import { StorageService, ErrorHandler } from '../utils/helpers';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user?: any;
}

class AuthService {
  private baseURL = API_URL;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${this.baseURL}/api/login`,
        credentials
      );
      
      if (response.status === 200 && response.data.token) {
        await StorageService.setToken(response.data.token);
        return response.data;
      }
      
      throw new Error('Login failed');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 401) {
          throw new Error('Invalid username or password');
        } else if (status === 400) {
          throw new Error('Username and password are required');
        }
      }
      
      ErrorHandler.logError(error, 'AuthService.login');
      throw new Error('Network error. Check your connection.');
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${this.baseURL}/api/register`,
        credentials
      );
      
      if (response.status === 201 && response.data.token) {
        await StorageService.setToken(response.data.token);
        return response.data;
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        if (status === 400) {
          throw new Error('Username already exists');
        }
      }
      
      ErrorHandler.logError(error, 'AuthService.register');
      throw new Error('Network error. Check your connection.');
    }
  }

  async logout(): Promise<void> {
    try {
      await StorageService.removeToken();
    } catch (error) {
      ErrorHandler.logError(error, 'AuthService.logout');
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    return await StorageService.getToken();
  }
}

export const authService = new AuthService();