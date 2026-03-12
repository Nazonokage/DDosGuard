import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Legacy CRA-style PHP backend, same as basis `proxy` setting
      '/api': 'http://localhost/capstonebackend',
      // Existing proxy example (kept in case you still need it)
      '/social_credit/api': 'http://localhost:5000',
    },
  },
})
