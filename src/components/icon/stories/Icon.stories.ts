import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  SIconAdd,
  SIconDelete,
  SIconEdit,
  SIconSearch,
  SIconArrowRight,
  SIconLoading,
} from 'serenova-ui'

const meta = {
  title: '组件/Icon',
  component: SIconAdd,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '六个真实内联 SVG 图标。可从 serenova-ui 或 serenova-ui/icons 具名导入；独立使用无需 CSS。size 默认 24，color 缺省继承；Button 槽内默认 16 px。Loading 图形自身不旋转。',
      },
    },
  },
  args: { size: 24 },
  argTypes: { size: { control: 'text' }, color: { control: 'color' } },
  render: (args) => ({
    components: { SIconAdd, SIconDelete, SIconEdit, SIconSearch, SIconArrowRight, SIconLoading },
    setup: () => ({ args }),
    template: `<div style="display:flex;gap:24px;color:#7c3aed"><SIconAdd v-bind="args" /><SIconDelete v-bind="args" /><SIconEdit v-bind="args" /><SIconSearch v-bind="args" /><SIconArrowRight v-bind="args" /><SIconLoading v-bind="args" /></div>`,
  }),
} satisfies Meta<typeof SIconAdd>
export default meta
type Story = StoryObj<typeof meta>
export const Gallery: Story = {}
