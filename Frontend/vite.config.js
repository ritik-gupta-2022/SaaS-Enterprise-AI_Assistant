import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5173,      // Ensure the port matches
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});