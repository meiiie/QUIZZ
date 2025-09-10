// ========================================================================
// FILE: src/App.tsx
// PURPOSE: Main application component - Entry point for routing
// BEST PRACTICE: App.tsx chỉ nên chứa logic toàn cục và gọi routing chính
// ========================================================================
import { AppRoutes } from './routes';
import './index.css';

function App() {
  // Nhiệm vụ duy nhất của App là render hệ thống routing
  return <AppRoutes />;
}

export default App;
