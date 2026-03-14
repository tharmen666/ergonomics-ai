import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Splits libraries from app logic to improve caching and load times
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group all Google-related libs into one chunk
            if (id.includes('googleapis') || id.includes('@google')) {
              return 'vendor-google';
            }
            // Everything else into a general vendor chunk
            return 'vendor';
          }
        },
      },
    },
    // Raises the warning threshold — our vendor chunk is intentionally large
    chunkSizeWarningLimit: 1000,
  },
});

