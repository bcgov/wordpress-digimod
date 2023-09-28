import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue()],
  // resolve: {
  //   alias: {
  //     '@': fileURLToPath(new URL('./src', import.meta.url))
  //   }
  // },
  polyfillModulePreload: false,
  rollupOptions: {
    input: {
      // public: fileURLToPath(new URL('./../../../public.html', import.meta.url))// "../../../public.html",//resolve(__dirname, 'public.html'),
      // admin: resolve(__dirname, 'admin.html'),
      // vue: resolve(__dirname,'blocks/wcag-vue-app/wcag-app/index.html')
      // main: 'index.html'
    },
  },
})
