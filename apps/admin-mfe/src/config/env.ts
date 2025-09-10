// Environment configuration for VMU Admin Dashboard
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
  },
  
  app: {
    name: import.meta.env.VITE_APP_NAME || 'VMU Quiz Admin Dashboard',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  },
  
  features: {
    enableMocking: import.meta.env.NODE_ENV === 'development',
    enableDevTools: import.meta.env.NODE_ENV === 'development',
  },
} as const;
