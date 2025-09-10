// E:/Sach/DuAn/quiz_online/apps/host-shell/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'host_shell',
      remotes: {
        student_mfe: 'http://localhost:5001/assets/remoteEntry.js',
        admin_mfe: 'http://localhost:5002/assets/remoteEntry.js',
        teacher_mfe: 'http://localhost:5003/assets/remoteEntry.js'
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: false }
      }
    })
  ],
  server: {
    port: 5173,
    host: '0.0.0.0',
    cors: true,
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
    cors: true,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [],
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js'
      }
    }
  },
});