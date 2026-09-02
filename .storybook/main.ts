import { readFileSync } from 'node:fs'
import { dirname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/vue3-vite'
import type { Alias, Plugin } from 'vite'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = resolve(projectRoot, 'dist')
const sourceRoot = resolve(projectRoot, 'src')
const previewMode = process.env.SERENOVA_STORYBOOK_MODE === 'dist' ? 'dist' : 'source'

interface PackageManifest {
  exports?: {
    '.'?: {
      import?: unknown
    }
    './style.css'?: unknown
  }
}

function normalizeAliases(alias: readonly Alias[] | Record<string, string> | undefined): Alias[] {
  if (!alias) return []
  if (Array.isArray(alias)) return [...alias]

  return Object.entries(alias).map(([find, replacement]) => ({ find, replacement }))
}

function isInside(path: string, directory: string) {
  return path === directory || path.startsWith(directory + sep)
}

function resolveDistExport(target: unknown, exportName: string) {
  if (typeof target !== 'string' || !target.startsWith('./')) {
    throw new Error(`package.json 中的 ${exportName} 导出必须是相对文件路径。`)
  }

  const resolvedTarget = resolve(projectRoot, target)
  if (!isInside(resolvedTarget, distRoot)) {
    throw new Error(`Storybook 产物模式只允许 ${exportName} 指向 dist：${target}`)
  }

  return resolvedTarget
}

function resolveDistEntries() {
  const packageJson = JSON.parse(
    readFileSync(resolve(projectRoot, 'package.json'), 'utf8'),
  ) as PackageManifest

  return {
    packageEntry: resolveDistExport(packageJson.exports?.['.']?.import, '包根 ESM'),
    styleEntry: resolveDistExport(packageJson.exports?.['./style.css'], '样式子路径'),
  }
}

function createDistSourceGuard(): Plugin {
  return {
    name: 'serenova-storybook-dist-source-guard',
    enforce: 'pre',
    load(id) {
      const cleanId = id.split('?', 1)[0]
      const isStoryAsset = cleanId.replaceAll('\\', '/').includes('/stories/')

      if (isInside(cleanId, sourceRoot) && !isStoryAsset) {
        throw new Error('Storybook 产物模式禁止读取组件源码：' + cleanId)
      }
    },
  }
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
    const { packageEntry, styleEntry } =
      previewMode === 'dist'
        ? resolveDistEntries()
        : {
            packageEntry: resolve(projectRoot, 'src/index.ts'),
            styleEntry: resolve(projectRoot, 'src/styles/index.css'),
          }

    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: [
        { find: /^serenova-ui\/style\.css$/, replacement: styleEntry },
        { find: /^serenova-ui$/, replacement: packageEntry },
        ...normalizeAliases(viteConfig.resolve?.alias),
      ],
    }
    if (previewMode === 'dist') {
      viteConfig.plugins = [...(viteConfig.plugins ?? []), createDistSourceGuard()]
    }

    return viteConfig
  },
}

export default config
