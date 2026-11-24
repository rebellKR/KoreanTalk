import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // GitHub Pages(하위 경로)에서도 파일을 찾을 수 있게 상대 경로 사용
})
