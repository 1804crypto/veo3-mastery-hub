import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY),
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || env.REACT_APP_API_BASE_URL || ''),
      'process.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY || ''),
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/server/dist/**'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            utils: ['@tanstack/react-query'],
          },
        },
      },
    },
  };
});
