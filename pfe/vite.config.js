import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    // Disable source maps for CSS to prevent the warning
    devSourcemap: false
  }
});