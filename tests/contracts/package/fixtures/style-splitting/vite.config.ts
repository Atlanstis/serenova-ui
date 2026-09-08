import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { componentStyles } from '../../../../../build/component-styles.ts'

export default defineConfig({
  plugins: [
    vue(),
    componentStyles({ selected: 'selected/style.css', unrelated: 'unrelated/style.css' }),
  ],
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
