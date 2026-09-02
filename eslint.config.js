import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    name: 'serenova/ignores',
    ignores: [
      'dist/**',
      'coverage/**',
      '.output/**',
      'public/**',
      'storybook-static/**',
      'storybook-static-dist/**',
      'playwright-report/**',
      'test-results/**',
      '**/*.min.*',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    name: 'serenova/source-files',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
  },
  {
    name: 'serenova/vue-typescript-parser',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    name: 'serenova/node-files',
    files: [
      '*.config.{js,mjs,cjs,ts,mts,cts}',
      'scripts/**/*.{js,mjs,cjs,ts,mts,cts}',
      'tests/package/**/*.{js,mjs,cjs,ts,mts,cts}',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    name: 'serenova/test-files',
    files: ['**/*.{spec,test}.{js,mjs,cjs,ts,mts,cts,tsx}'],
    rules: {
      'vue/one-component-per-file': 'off',
    },
  },
  eslintConfigPrettier,
]
