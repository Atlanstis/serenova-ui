import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const fixtureRoot = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(fixtureRoot, '../../../..')

export default defineConfig({
  root: fixtureRoot,
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /^serenova-ui$/,
        replacement: resolve(projectRoot, 'dist/serenova-ui.js'),
      },
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    fs: {
      allow: [projectRoot],
    },
  },
})
