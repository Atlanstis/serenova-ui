import { autoComponentStyles } from './build/auto-component-styles.ts'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), autoComponentStyles()],
  build: {
    cssCodeSplit: true,
    lib: {
      entry: {
        'serenova-ui': 'src/index.ts',
        'button/index': 'src/components/button/index.ts',
        'theme-provider/index': 'src/components/theme-provider/index.ts',
        'themes/light': 'src/theme/presets/light.ts',
        'icons/index': 'src/components/icon/index.ts',
      },
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rolldownOptions: {
      external: ['vue'],
      output: { exports: 'named' },
    },
  },
})
