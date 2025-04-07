import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crx from 'vite-plugin-crx';
import path from 'path';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest: './manifest.json'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
        options: 'src/options/index.html',
        background: 'src/background/index.js',
        content: 'src/content/index.js',
      }
    }
  }
});
