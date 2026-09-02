import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/bundle-entry.ts',
      name: 'SerenovaUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'serenova-ui.js' : 'serenova-ui.cjs'),
      cssFileName: 'serenova-ui',
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
      },
    },
  },
})
