// src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

// Hàm bất đồng bộ để khởi động MSW
async function enableMocking() {
  // Chỉ chạy MSW ở môi trường development để không ảnh hưởng đến production
  if (import.meta.env.PROD) {
    return
  }
 
  // Import worker từ file đã tạo ở bước trước
  const { worker } = await import('./mocks/browser')
 
  // Bắt đầu worker và lắng nghe các request
  // Bằng cách `await`, chúng ta đảm bảo MSW sẵn sàng trước khi app render
  return worker.start({ onUnhandledRequest: 'bypass' })
}
 
// Gọi hàm enableMocking, sau khi nó hoàn tất thì mới render ứng dụng
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
})