import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
     allowedHosts: ['localui.abdulmajid.in', '.abdulmajid.in'],
    proxy: {
      '/auth': 'http://localhost:8080',
      '/categories': 'http://localhost:8080',
      '/payment': 'http://localhost:8080',
      '/expenses': 'http://localhost:8080',
      '/analytics': 'http://localhost:8080',
    }
  }
})
