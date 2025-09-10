import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'admin_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './AdminApp': './src/App.tsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],

  // ✅ Cấu hình server cho micro-frontend
  server: {
    port: 5002,
    host: '0.0.0.0', // Cho phép truy cập từ bên ngoài
    cors: true, // Bật CORS cho micro-frontend
  },

  // ✅ Cấu hình preview (cho production build)
  preview: {
    port: 5002,
    host: '0.0.0.0',
    cors: true,
  },

  // ✅ Thêm toàn bộ phần resolve.alias này vào
  resolve: {
    alias: {
      '@quiz-online': resolve('../../packages'),
    },
  },

  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})