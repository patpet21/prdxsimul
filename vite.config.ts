import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    assetsDir: 'assets',
  },
  // Ensure assets are linked correctly in production
  base: '/',
  server: {
    port: 3000,
    open: true
  }
});