// ========================================================================
// FILE: src/components/shared/ApiProvider.tsx
// PURPOSE: API context provider for application
// DESCRIPTION: React context for API services and configuration
// ========================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiServices } from '../../api';
import { useAuthStore } from '../../store';
import { ApiError } from '../../types';

// ============= API CONTEXT =============
interface ApiContextType {
  services: typeof apiServices;
  isOnline: boolean;
  retryFailedRequests: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | null>(null);

// ============= API PROVIDER COMPONENT =============
interface ApiProviderProps {
  children: React.ReactNode;
  mockMode?: boolean; // For development/testing
}

export function ApiProvider({ children, mockMode: _mockMode = false }: ApiProviderProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [failedRequests, setFailedRequests] = useState<(() => Promise<void>)[]>([]);
  
  const { clearAuth } = useAuthStore();

  // ============= NETWORK STATUS MONITORING =============
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Retry failed requests when back online
      retryFailedRequests();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ============= GLOBAL ERROR HANDLING =============
  useEffect(() => {
    const handleUnauthorized = (error: ApiError) => {
      if (error.status === 401) {
        clearAuth();
        window.location.href = '/login';
      }
    };

    // Set up global error interceptor
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok && response.status === 401) {
          handleUnauthorized(new ApiError('Unauthorized', 401));
        }
        
        return response;
      } catch (error) {
        // Handle network errors
        if (!navigator.onLine) {
          console.warn('Network request failed - offline');
        }
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [clearAuth]);

  // ============= RETRY FAILED REQUESTS =============
  const retryFailedRequests = async () => {
    if (failedRequests.length === 0) return;

    console.log(`Retrying ${failedRequests.length} failed requests...`);
    
    const requests = [...failedRequests];
    setFailedRequests([]);

    await Promise.allSettled(requests.map(req => req()));
  };

  // ============= CONTEXT VALUE =============
  const contextValue: ApiContextType = {
    services: apiServices,
    isOnline,
    retryFailedRequests,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {/* Network Status Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          You are offline. Some features may not work properly.
        </div>
      )}
      {children}
    </ApiContext.Provider>
  );
}

// ============= HOOK TO USE API CONTEXT =============
export function useApiContext() {
  const context = useContext(ApiContext);
  
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  
  return context;
}

// ============= HOOK FOR API SERVICES =============
export function useApiServices() {
  const { services } = useApiContext();
  return services;
}

// ============= HOOK FOR NETWORK STATUS =============
export function useNetworkStatus() {
  const { isOnline, retryFailedRequests } = useApiContext();
  return { isOnline, retryFailedRequests };
}
