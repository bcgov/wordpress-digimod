import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    minify: 'terser',
    terserOptions: {
      keep_fnames: true
    },

    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      input: {
        public: resolve(__dirname, 'public.html'),
        admin: resolve(__dirname, 'admin.html'),
        vue: resolve(__dirname, 'blocks/vue-blocks/vue.html')
      }
    }
  },
})
