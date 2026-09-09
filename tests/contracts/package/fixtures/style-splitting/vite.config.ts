import { autoComponentStyles } from '../../../../../build/auto-component-styles.ts'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), autoComponentStyles()],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        selected: fileURLToPath(new URL('./selected.ts', import.meta.url)),
        unrelated: fileURLToPath(new URL('./unrelated.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rolldownOptions: { external: ['vue'] },
  },
})
