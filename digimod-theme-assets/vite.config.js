import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    polyfillModulePreload: false,
    rollupOptions: {
      input: {
        public: resolve(__dirname, 'public.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})