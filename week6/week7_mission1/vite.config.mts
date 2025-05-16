// vite.config.mts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/v1': {
        target: 'http://localhost:8000', // 여기를 실제 백엔드 API 주소로!
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
