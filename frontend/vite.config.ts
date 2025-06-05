import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {                 // ← add this
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});