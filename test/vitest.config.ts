import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    entries: [],
  },
  plugins: [Vue()],
  test: {
    environment: 'happy-dom',
  },
})
