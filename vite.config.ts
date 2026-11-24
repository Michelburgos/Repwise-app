/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Acepta tanto VITE_* (Vite) como NEXT_PUBLIC_* (el nombre que ya usas).
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  plugins: [
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
