/**
 * App Providers - Student MFE
 * 
 * Triết lý: Quản lý các Provider cần thiết cho MFE
 * Không có Router vì Host-Shell sẽ lo routing
 */

import { type FC, type ReactNode, useEffect, useState } from 'react';
import { api } from '../../shared/api';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }) => {
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    const initializeAPI = async () => {
      try {
        console.log('🔄 Initializing API system...');
        
        // Give MSW a moment to fully initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await api.initialize();
        console.log('✅ API system initialized successfully');
        setIsApiReady(true);
      } catch (error) {
        console.error('❌ Failed to initialize API system:', error);
        // Continue anyway for graceful degradation
        setIsApiReady(true);
      }
    };

    initializeAPI();
  }, []);

  // Show loading while API initializes
  if (!isApiReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Có thể thêm ThemeProvider, ErrorBoundary, etc. */}
      {children}
    </>
  );
};

export default AppProviders;
