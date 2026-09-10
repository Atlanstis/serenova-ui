import { h } from 'vue'
import { SThemeProvider } from '../src/components/theme-provider'
import { lightPreset } from '../src/theme/presets/light'
import type { Preview } from '@storybook/vue3-vite'

import './preview.css'

document.documentElement.lang = 'zh-CN'
document.documentElement.dir = 'ltr'

const preview: Preview = {
  decorators: [
    (story) => {
      const preset = lightPreset
      const t = preset.common
      return {
        setup: () => () =>
          h(
            'div',
            {
              class: 'preview-theme',
              style: {
                '--preview-color-text': t.colorText,
                '--preview-color-surface': t.colorSurface,
              },
            },
            [h(SThemeProvider, { preset }, { default: () => h(story()) })],
          ),
      }
    },
  ],
  parameters: {
    controls: {
      expanded: true,
    },
    docs: {
      codePanel: true,
      stories: {
        // Docs 主示例已经在顶部展示，列表仅保留独立用法。
        filter: (story: { tags: string[] }) => !story.tags.includes('docs-primary'),
      },
    },
    options: {
      storySort: {
        order: ['组件', ['Button']],
      },
    },
  },
}

export default preview
