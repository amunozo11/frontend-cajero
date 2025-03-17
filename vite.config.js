import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    allowedHosts: [
      'frontend-cajero.onrender.com',
      'localhost' // Mantén localhost para desarrollo local
    ]
  },
  server: {
    proxy: {
      // Si tienes una API backend, configura el proxy aquí
      '/api': {
        target: 'https://backend-cajero.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});