import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // PWA: 홈 화면에 추가하면 앱처럼 열리고, 한 번 열면 비행기 모드에서도 동작
    VitePWA({
      registerType: 'autoUpdate', // 새 버전을 올리면 다음에 열 때 자동으로 바뀜
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: '韓国語トーク — KoreanTalk',
        short_name: '韓国語トーク',
        description: '日本人のための韓国語学習アプリ',
        lang: 'ja',
        start_url: './',
        scope: './',
        display: 'standalone', // 주소창 없이 앱처럼
        background_color: '#F3F4F6',
        theme_color: '#5267E8',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'], // 단어 데이터(js)까지 전부 미리 저장
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 큰 단어 파일(최대 1MB 정도)도 저장되게 5MB까지 허용
        runtimeCaching: [
          {
            // 구글 폰트: 한 번 받으면 기기에 1년 보관 → 오프라인에서도 같은 글꼴
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  base: './', // GitHub Pages(하위 경로 /KoreanTalk/)에서도 파일을 찾을 수 있게 상대 경로 사용
})
