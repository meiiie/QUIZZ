import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    federation({
      name: 'student_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './StudentApp': './src/App.tsx'
      },
      shared: ['react', 'react-dom']
    })
  ],
  server: {
    port: 5001,
    cors: true
  },
  preview: {
    port: 5001,
    cors: true,
    host: '0.0.0.0'
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});