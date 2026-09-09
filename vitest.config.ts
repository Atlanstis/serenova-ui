import { autoComponentStyles } from './build/auto-component-styles.ts'
import { playwright } from '@vitest/browser-playwright'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue(), autoComponentStyles()],
  optimizeDeps: { include: ['vue'] },
  resolve: {
    dedupe: ['vue', '@vue/runtime-core', '@vue/runtime-dom', '@vue/reactivity', '@vue/shared'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          css: true,
          environment: 'happy-dom',
          include: ['tests/**/*.unit.spec.ts'],
          setupFiles: ['./tests/support/vitest/unit.setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              contextOptions: {
                colorScheme: 'light',
                locale: 'zh-CN',
                timezoneId: 'Asia/Shanghai',
              },
            }),
            instances: [{ browser: 'chromium' }],
            viewport: { height: 720, width: 1280 },
          },
          include: ['tests/**/*.integration.spec.ts'],
          setupFiles: ['./tests/support/vitest/integration.setup.ts'],
        },
      },
    ],
  },
})
