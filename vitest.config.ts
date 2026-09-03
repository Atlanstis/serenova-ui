import { playwright } from '@vitest/browser-playwright'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
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
          include: ['tests/unit/**/*.spec.ts'],
          setupFiles: ['./tests/setup/unit.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
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
          include: ['tests/browser/**/*.browser.spec.ts'],
          setupFiles: ['./tests/setup/browser.ts'],
        },
      },
    ],
  },
})
