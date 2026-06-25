import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Keep framer-motion isolated (large, self-contained)
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            // Keep lucide icons isolated (tree-shakeable, no React dep risk)
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Consolidate React + all utility packages into one vendor-core chunk.
            // This eliminates the circular dependency: vendor-utils → vendor-react → vendor-utils
            // that occurred because packages like zustand, three.js and @react-three/*
            // import React internally, making them co-dependent with the react chunk.
            return 'vendor-core';
          }
        },
      },
    },
  },
});

