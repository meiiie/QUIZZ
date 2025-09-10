import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/student-mfe-global.css'
import App from './App.tsx'

/**
 * Enterprise MSW Setup - Student MFE
 * Direct MSW initialization following best practices
 */
async function enableMocking() {
  // Only enable MSW in development
  if (typeof window === 'undefined' || window.location.hostname !== 'localhost') {
    console.log('🔧 Production mode - MSW disabled');
    return;
  }

  try {
    console.log('🎭 Initializing MSW for development...');
    
    // Import MSW worker
    const { worker } = await import('./shared/api/msw/browser');
    
    // Start MSW with proper configuration
    await worker.start({
      onUnhandledRequest: 'warn',
      quiet: false,
      waitUntilReady: true,
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
          scope: '/'
        }
      }
    });
    
    console.log('✅ MSW: Mock Service Worker started successfully');
    console.log('🎯 MSW: Ready to intercept API calls');
    
  } catch (error) {
    console.error('❌ MSW: Failed to start Mock Service Worker:', error);
    console.log('📝 Application will continue without mocking');
  }
}

/**
 * Initialize and render application
 */
async function initializeApp() {
  // 1. First: Setup MSW (if in development)
  await enableMocking();
  
  // 2. Then: Render React app
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  
  console.log('🎉 Student MFE: Application rendered successfully');
}

// Start the application
initializeApp().catch(error => {
  console.error('❌ Failed to initialize application:', error);
  
  // Fallback: Render app anyway
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
