// App Constants
export const APP_NAME = 'Grouply';

// Theme Constants
export const THEME = {
  colors: {
    primary: '#1DA1F2',
    background: '#ffffff',
    cardBackground: '#F5F8FA',
    border: '#E1E8ED',
    textPrimary: '#14171A',
    textSecondary: '#657786',
    gray: '#657786',
    white: '#ffffff',
    error: '#FF4C4C',
    success: '#17BF63',
    warning: '#FFAD1F',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 12,
    md: 20,
    lg: 30,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

// Animation Constants
export const ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  delays: {
    none: 0,
    short: 100,
    medium: 200,
    long: 400,
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
} as const;