import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/generator-surat-laporan-bisnis/',
  server: {
    port: 5176,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})