import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Decorator, Preview } from '@storybook/vue3-vite'

import './preview.css'

const withDirection: Decorator = (story, context) => {
  const direction = context.globals.direction === 'rtl' ? 'rtl' : 'ltr'

  document.documentElement.lang = 'zh-CN'
  document.documentElement.dir = direction

  return story()
}

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
      parentSelector: 'html',
    }),
    withDirection,
  ],
  globalTypes: {
    direction: {
      description: '组件预览方向',
      toolbar: {
        title: '方向',
        icon: 'globe',
        items: [
          { value: 'ltr', title: 'LTR（从左到右）' },
          { value: 'rtl', title: 'RTL（从右到左）' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    direction: 'ltr',
    theme: 'light',
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    docs: {
      codePanel: true,
    },
    layout: 'padded',
    options: {
      storySort: {
        order: ['组件', ['Button']],
      },
    },
    viewport: {
      options: {
        mobile: {
          name: '移动端 390 × 844',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
        tablet: {
          name: '平板 768 × 1024',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: '桌面端 1280 × 900',
          styles: { width: '1280px', height: '900px' },
          type: 'desktop',
        },
      },
    },
  },
}

export default preview
