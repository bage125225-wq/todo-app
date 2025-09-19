import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/todo-app/', // ⚠️ 和你的仓库名一致
  plugins: [vue()]
})
