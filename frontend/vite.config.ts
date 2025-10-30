import { defineConfig } from 'vite';

// Dev proxy so that requests to /api are forwarded to the backend on :4000
export default defineConfig({
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
