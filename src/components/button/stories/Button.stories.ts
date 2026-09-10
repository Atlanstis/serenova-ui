import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { buttonSizes, buttonVariants, SButton, type ButtonProps } from 'serenova-ui'
import AppearanceExample from './examples/Appearance.vue'
import appearanceSource from './examples/Appearance.vue?raw'
import SizesExample from './examples/Sizes.vue'
import sizesSource from './examples/Sizes.vue?raw'
import DisabledAndLoadingExample from './examples/DisabledAndLoading.vue'
import disabledAndLoadingSource from './examples/DisabledAndLoading.vue?raw'
import IconsExample from './examples/Icons.vue'
import iconsSource from './examples/Icons.vue?raw'
import IconOnlyExample from './examples/IconOnly.vue'
import iconOnlySource from './examples/IconOnly.vue?raw'
import TextExample from './examples/Text.vue'
import textSource from './examples/Text.vue?raw'
import InteractionExample from './examples/Interaction.vue'
import interactionSource from './examples/Interaction.vue?raw'
import ThemeOverrideExample from './examples/ThemeOverride.vue'
import themeOverrideSource from './examples/ThemeOverride.vue?raw'
import PlaygroundExample from './examples/Playground.vue'
import playgroundSource from './examples/Playground.vue?raw'

type ButtonStoryArgs = ButtonProps & {
  label: string
  icons: 'none' | 'prefix' | 'suffix' | 'both'
  onClick: ReturnType<typeof fn<(event: MouseEvent) => void>>
}

const meta = {
  id: 'components-button',
  title: '组件/Button',
  component: SButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '原生按钮组件，支持四种语义类型、三档尺寸、可组合的 Text 和 Ghost、图标、禁用与加载。Tab 聚焦后可用 Enter 或 Space 激活。',
      },
    },
    controls: {
      disable: true,
      include: [
        'variant',
        'size',
        'text',
        'ghost',
        'iconOnly',
        'disabled',
        'loading',
        'label',
        'icons',
      ],
    },
  },
  argTypes: {
    variant: { control: 'select', options: buttonVariants, description: '按钮的视觉类型。' },
    size: { control: 'select', options: buttonSizes, description: '按钮尺寸。' },
    text: { control: 'boolean', description: '文字外观，可与四种语义类型组合，优先于 Ghost。' },
    ghost: {
      control: 'boolean',
      description: '透明底描边；文字按钮不适用。',
      if: { arg: 'text', truthy: false },
    },
    iconOnly: { control: 'boolean', description: '正方形纯图标按钮。' },
    disabled: { control: 'boolean', description: '禁用交互。' },
    loading: { control: 'boolean', description: '显示加载反馈并阻止重复操作。' },
    label: {
      control: 'text',
      description: '展示文案。',
      if: { arg: 'iconOnly', truthy: false },
    },
    icons: {
      control: 'select',
      options: ['none', 'prefix', 'suffix', 'both'],
      description: '图标位置；纯图标模式固定显示新增图标。',
      if: { arg: 'iconOnly', truthy: false },
    },
    onClick: { control: false, description: '可用时发出携带原生 MouseEvent 的 click。' },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    text: false,
    ghost: false,
    iconOnly: false,
    disabled: false,
    loading: false,
    label: '保存更改',
    icons: 'none',
    onClick: fn<(event: MouseEvent) => void>(),
  },
} satisfies Meta<ButtonStoryArgs>

export default meta
type Story = StoryObj<ButtonStoryArgs>

export const Playground: Story = {
  name: '参数调试',
  tags: ['!dev', 'docs-primary'],
  render: (args) => ({
    components: { PlaygroundExample },
    setup: () => ({ args }),
    template: '<PlaygroundExample v-bind="args" />',
  }),
  parameters: {
    controls: { disable: false },
    docs: {
      description: {
        story:
          'Controls 用于组合调试。Show code 始终显示完整 Vue 文件原文及默认值，不随 Controls 改写；预览会响应当前参数。',
      },
      source: { code: playgroundSource, type: 'code', language: 'html' },
    },
  },
}

export const Appearance: Story = {
  name: '类型与外观',
  render: () => ({
    components: { AppearanceExample },
    template: '<AppearanceExample />',
  }),
  parameters: {
    docs: {
      description: {
        story: '四种语义类型分别支持默认、Ghost 和文字外观。悬停、按下或 Tab 聚焦可观察反馈。',
      },
      source: { code: appearanceSource, type: 'code', language: 'html' },
    },
  },
}

export const Sizes: Story = {
  name: '尺寸',
  render: () => ({
    components: { SizesExample },
    template: '<SizesExample />',
  }),
  parameters: {
    docs: {
      description: { story: '相同文案对照三档尺寸，标注默认主题高度。' },
      source: { code: sizesSource, type: 'code', language: 'html' },
    },
  },
}

export const DisabledAndLoading: Story = {
  name: '禁用与加载',
  render: () => ({
    components: { DisabledAndLoadingExample },
    template: '<DisabledAndLoadingExample />',
  }),
  parameters: {
    docs: {
      description: { story: '加载沿用禁用配色并阻止重复操作；点击保存，1.2 秒后恢复可用。' },
      source: { code: disabledAndLoadingSource, type: 'code', language: 'html' },
    },
  },
}

export const Icons: Story = {
  name: '图标插槽',
  render: () => ({
    components: { IconsExample },
    template: '<IconsExample />',
  }),
  parameters: {
    docs: {
      description: {
        story: '通过 icon 和 suffixIcon 插槽组合图标。加载时保留文案，替换前置图标并隐藏后置图标。',
      },
      source: { code: iconsSource, type: 'code', language: 'html' },
    },
  },
}

export const IconOnly: Story = {
  name: '纯图标按钮',
  render: () => ({
    components: { IconOnlyExample },
    template: '<IconOnlyExample />',
  }),
  parameters: {
    docs: {
      description: { story: '纯图标按钮为正方形；可对照三档尺寸、Ghost、禁用与加载。' },
      source: { code: iconOnlySource, type: 'code', language: 'html' },
    },
  },
}

export const Text: Story = {
  name: '文字按钮',
  render: () => ({
    components: { TextExample },
    template: '<TextExample />',
  }),
  parameters: {
    docs: {
      description: {
        story:
          '文字按钮支持四种语义类型，text 优先于 ghost。悬停显示下划线，Tab 可查看焦点，点击无波纹；操作间距由容器 gap 控制。',
      },
      source: { code: textSource, type: 'code', language: 'html' },
    },
  },
}

export const Interaction: Story = {
  name: '点击与键盘交互',
  render: (args) => ({
    components: { InteractionExample },
    setup: () => ({ args }),
    template:
      '<InteractionExample :variant="args.variant" :size="args.size" :text="args.text" :ghost="args.ghost" :disabled="args.disabled" :loading="args.loading" @click="args.onClick" />',
  }),
  parameters: {
    controls: {
      disable: false,
      include: ['variant', 'size', 'text', 'ghost', 'disabled', 'loading'],
    },
    docs: {
      description: {
        story:
          '鼠标点击或聚焦后按 Enter、Space，每次有效激活计数一次。可调节 text 对照无波纹反馈；禁用和加载保持计数。play 用于调试，禁用分支仅检查禁用状态与计数，公共契约由独立测试验证。',
      },
      source: { code: interactionSource, type: 'code', language: 'html' },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByTestId('interaction-button')
    const count = canvas.getByTestId('click-count')
    const initialCount = Number(count.textContent)
    const initialCalls = args.onClick.mock.calls.length
    if (args.disabled || args.loading) {
      await expect(button).toBeDisabled()
      await expect(count).toHaveTextContent(String(initialCount))
      await expect(args.onClick).toHaveBeenCalledTimes(initialCalls)
      return
    }
    await userEvent.click(button)
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    await expect(args.onClick).toHaveBeenCalledTimes(initialCalls + 3)
    await expect(count).toHaveTextContent(String(initialCount + 3))
  },
}

export const ThemeOverride: Story = {
  name: '局部主题覆盖',
  render: () => ({
    components: { ThemeOverrideExample },
    template: '<ThemeOverrideExample />',
  }),
  parameters: {
    docs: {
      description: { story: '局部主色仅影响 SThemeProvider 内的按钮，外部按钮使用默认主色。' },
      source: { code: themeOverrideSource, type: 'code', language: 'html' },
    },
  },
}
