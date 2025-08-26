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
  private axiosConfig = {
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  };

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('AuthService: Attempting login to:', `${this.baseURL}/api/login`);
      console.log('AuthService: Using credentials:', { username: credentials.username });
      
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${this.baseURL}/api/login`,
        credentials,
        this.axiosConfig
      );
      
      if (response.status === 200 && response.data.token) {
        await StorageService.setToken(response.data.token);
        return response.data;
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.log('AuthService: Login error:', error);
      
      if (axios.isAxiosError(error)) {
        console.log('AuthService: Axios error details:', {
          message: error.message,
          code: error.code,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            timeout: error.config?.timeout
          },
          response: error.response ? {
            status: error.response.status,
            data: error.response.data
          } : 'No response'
        });
        
        if (error.response) {
          const status = error.response.status;
          if (status === 401) {
            throw new Error('Invalid username or password');
          } else if (status === 400) {
            throw new Error('Username and password are required');
          }
        } else if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to server. Make sure backend is running.');
        } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          throw new Error('Network error. Check your IP address and server connectivity.');
        }
      }
      
      ErrorHandler.logError(error, 'AuthService.login');
      throw new Error('Network error. Check your connection.');
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log('AuthService: Attempting registration to:', `${this.baseURL}/api/register`);
      
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${this.baseURL}/api/register`,
        credentials,
        this.axiosConfig
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