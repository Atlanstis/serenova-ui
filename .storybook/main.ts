import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/vue3-vite'
import type { Alias } from 'vite'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageEntry = resolve(projectRoot, 'src/index.ts')
const styleEntry = resolve(projectRoot, 'src/styles/index.css')

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
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: [
        { find: /^serenova-ui\/style\.css$/, replacement: styleEntry },
        { find: /^serenova-ui$/, replacement: packageEntry },
        ...normalizeAliases(viteConfig.resolve?.alias),
      ],
    }

    return viteConfig
  },
}

export default config
