import { publicComponentDocgen } from './public-component-docgen.ts'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: {
        plugin: 'vue-component-meta',
        tsconfig: 'tsconfig.storybook.json',
      },
    },
  },
  core: {
    disableTelemetry: true,
  },
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import('vite')

    // autoComponentStyles 已由根目录 vite.config.ts 加载。
    return mergeConfig(viteConfig, {
      plugins: [publicComponentDocgen()],
      resolve: {
        alias: [
          {
            find: /^serenova-ui$/,
            replacement: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
          },
        ],
      },
    })
  },
}

export default config
