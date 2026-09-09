import { autoComponentStyles } from '../build/auto-component-styles.ts'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/vue3-vite'
import type { Alias } from 'vite'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageEntry = resolve(projectRoot, 'src/index.ts')

function normalizeAliases(alias: readonly Alias[] | Record<string, string> | undefined): Alias[] {
  if (!alias) return []
  if (Array.isArray(alias)) return [...alias]

  return Object.entries(alias).map(([find, replacement]) => ({ find, replacement }))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
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
    viteConfig.plugins = [...(viteConfig.plugins ?? []), autoComponentStyles()]
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: [
        { find: /^serenova-ui$/, replacement: packageEntry },
        {
          find: /^serenova-ui\/button$/,
          replacement: resolve(projectRoot, 'src/components/button/index.ts'),
        },
        {
          find: /^serenova-ui\/theme-provider$/,
          replacement: resolve(projectRoot, 'src/components/theme-provider/index.ts'),
        },
        {
          find: /^serenova-ui\/themes\/light$/,
          replacement: resolve(projectRoot, 'src/theme/presets/light.ts'),
        },
        {
          find: /^serenova-ui\/icons$/,
          replacement: resolve(projectRoot, 'src/components/icon/index.ts'),
        },
        ...normalizeAliases(viteConfig.resolve?.alias),
      ],
    }

    return viteConfig
  },
}

export default config
