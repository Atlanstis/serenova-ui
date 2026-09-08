import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { SButton, SThemeProvider } from 'serenova-ui'

const meta = {
  title: '组件/ThemeProvider',
  component: SThemeProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '无 DOM 的主题提供者。通过默认插槽承载内容，支持预设、共享和组件覆盖，以及继承重置。没有业务事件或焦点行为。',
      },
    },
  },
  argTypes: {
    preset: { control: 'object', description: '完整主题预设；指定后清除父主题影响。' },
    tokens: { control: 'object', description: 'common 共享覆盖与 components 组件覆盖。' },
    inherit: { control: 'boolean', description: '未指定预设时继承父主题，默认 true。' },
  },
  args: { inherit: true },
  render: (args) => ({
    components: { SThemeProvider, SButton },
    setup: () => ({ args }),
    template: `<SThemeProvider :tokens="{ common: { colorPrimary: '#21885c' } }"><SThemeProvider v-bind="args"><SButton variant="primary">主题按钮</SButton></SThemeProvider></SThemeProvider>`,
  }),
} satisfies Meta<typeof SThemeProvider>

export default meta
type Story = StoryObj<typeof meta>
export const Inherit: Story = { name: '继承局部浅色覆盖' }
export const Reset: Story = { name: '重置为默认主题', args: { inherit: false } }
export const Override: Story = {
  name: '局部共享与组件覆盖',
  args: {
    tokens: {
      common: { colorPrimary: '#7c3aed' },
      components: { Button: { borderRadius: '12px' } },
    },
  },
}
