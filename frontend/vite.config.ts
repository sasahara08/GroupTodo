import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: true,        // 外部アクセスを許可
    port: 5173,        // ポート番号（任意で変更可能）
    strictPort: true,  // ポートが使われていたらエラーにする
  },
  optimizeDeps: {
    include: ['@mantine/core', '@mantine/hooks'],
  },
})