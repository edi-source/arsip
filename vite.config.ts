import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

// Amankan __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Mengizinkan semua koneksi luar (Termasuk dari URL Ngrok)
      allowedHosts: true, 
      host: '0.0.0.0', // Membuka port agar bisa di-forward oleh ngrok
      
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    // Tetap menggunakan sub-folder '/arsip/' hanya saat build production untuk GitHub Pages
    base: process.env.NODE_ENV === 'production' ? '/arsip/' : '/',
  };
});
