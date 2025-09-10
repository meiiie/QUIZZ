// ========================================================================
// FILE: src/main.tsx
// MỤC ĐÍCH: Điểm khởi đầu của ứng dụng.
// HÀNH ĐỘNG: Bọc toàn bộ ứng dụng trong <BrowserRouter> để kích hoạt routing.
// ========================================================================
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);