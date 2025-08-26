import { useState, useEffect } from 'react';
import { StorageService, ErrorHandler } from '../utils/helpers';

export interface UseAuthReturn {
  loading: boolean;
  userToken: string | null;
  checkToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  const checkToken = async () => {
    try {
      const token = await StorageService.getToken();
      setUserToken(token);
    } catch (error) {
      ErrorHandler.logError(error, 'useAuth.checkToken');
      setUserToken(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await StorageService.removeToken();
      setUserToken(null);
    } catch (error) {
      ErrorHandler.logError(error, 'useAuth.logout');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return {
    loading,
    userToken,
    checkToken,
    logout,
  };
}