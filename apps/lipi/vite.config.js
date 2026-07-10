import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3006,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
