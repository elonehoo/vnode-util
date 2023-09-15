import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  optimizeDeps: {
    entries: [],
  },
  plugins: [Vue()],
  test: {
    environment: 'happy-dom',
  },
})
