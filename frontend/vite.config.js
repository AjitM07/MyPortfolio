import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],

  // Dev server proxy — only used during local development.
  // In production the frontend reads VITE_API_URL directly.
  server: {
    proxy:
      mode === 'development'
        ? {
            '/api': {
              target: 'http://localhost:5000',
              changeOrigin: true,
            },
          }
        : undefined,
  },

  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    // Raise the chunk-size warning threshold a little for libraries like tsparticles
    chunkSizeWarningLimit: 800,
  },
}));
