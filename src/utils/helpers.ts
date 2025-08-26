import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Storage utilities for managing app data
 */
export class StorageService {
  static async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  static async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

/**
 * Format utilities for data formatting
 */
export class FormatUtils {
  static formatGroupCode(code: string): string {
    // Remove any existing hyphens and convert to uppercase
    const cleanCode = code.replace(/-/g, '').toUpperCase();
    
    // Add hyphen after 4 characters if length is greater than 4
    if (cleanCode.length > 4) {
      return `${cleanCode.slice(0, 4)}-${cleanCode.slice(4, 8)}`;
    }
    
    return cleanCode;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    
    return { isValid: true };
  }
}

/**
 * Error handling utilities
 */
export class ErrorHandler {
  static getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred';
  }

  static logError(error: any, context?: string): void {
    const errorMessage = this.getErrorMessage(error);
    const logMessage = context ? `[${context}] ${errorMessage}` : errorMessage;
    console.error(logMessage, error);
  }
}