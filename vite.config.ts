import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Göreli yol: GitHub Pages alt dizini dahil her yerde çalışır
  base: './',
  plugins: [react()],
})
