import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
});

