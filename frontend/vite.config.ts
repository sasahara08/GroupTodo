import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,        // 外部アクセスを許可
    port: 5173,        // ポート番号（任意で変更可能）
    strictPort: true,  // ポートが使われていたらエラーにする
    proxy: {
      // /api と /sanctum へのリクエストをバックエンドにプロキシ
      '/api': {
        target: 'http://localhost:80',  // Nginxが動作しているポート
        changeOrigin: true,
        secure: false,
      },
      '/sanctum': {
        target: 'http://localhost:80',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['@mantine/core', '@mantine/hooks'],
  },
})