import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import federation from '@originjs/vite-plugin-federation'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'teacher_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './TeacherApp': './src/App.tsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  
  server: {
    port: 5003,
    host: '0.0.0.0',
    cors: true,
  },

  preview: {
    port: 5003,
    host: '0.0.0.0',
    cors: true,
  },

  // Path mapping for imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
