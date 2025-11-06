import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Allow overriding backend URL via VITE_BACKEND_URL (useful for local prod builds)
    const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:4000';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Proxy API requests to the backend dev server to avoid CORS
        proxy: {
          '/api': {
            target: backendUrl,
            changeOrigin: true,
            secure: false,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        // expose backend base for runtime code if needed
        'process.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL || backendUrl),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
