import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { buttonNativeTypes, buttonSizes, buttonVariants, SButton } from 'serenova-ui'
import 'serenova-ui/style.css'

import './Button.stories.css'

const meta = {
  id: 'components-button',
  title: '组件/Button',
  component: SButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Serenova UI 的原生按钮组件。支持视觉变体、尺寸、禁用、加载、块级布局、原生表单类型以及默认和图标插槽。',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: buttonVariants,
      description: '按钮的视觉样式。',
    },
    size: {
      control: 'select',
      options: buttonSizes,
      description: '按钮尺寸。',
    },
    nativeType: {
      control: 'select',
      options: buttonNativeTypes,
      description: '原生 button 元素的 type 属性。',
    },
    block: {
      control: 'boolean',
      description: '是否占满父容器宽度。',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用交互。',
    },
    loading: {
      control: 'boolean',
      description: '是否显示加载状态并阻止交互。',
    },
    onClick: {
      description: '按钮可用时触发的 click 公共事件。',
    },
  },
  args: {
    variant: 'default',
    size: 'medium',
    nativeType: 'button',
    block: false,
    disabled: false,
    loading: false,
    onClick: fn(),
  },
  render: (args) => ({
    components: { SButton },
    setup() {
      return { args }
    },
    template: `<SButton v-bind="args" data-testid="playground-button">保存更改</SButton>`,
  }),
} satisfies Meta<typeof SButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  args: {
    onClick: fn(),
  },
  render: (args) => ({
    components: { SButton },
    setup() {
      return { args, buttonVariants }
    },
    template: `
      <div class="button-story" data-story="button-variants">
        <section>
          <h2>视觉变体</h2>
          <div class="button-story__row" data-testid="button-variant-matrix">
            <SButton
              v-for="variant in buttonVariants"
              :key="variant"
              :variant="variant"
              :size="args.size"
              @click="args.onClick"
            >
              {{ variant }}
            </SButton>
          </div>
        </section>
      </div>
    `,
  }),
}

export const SizesAndStates: Story = {
  args: {
    onClick: fn(),
  },
  render: (args) => ({
    components: { SButton },
    setup() {
      return { args, buttonSizes }
    },
    template: `
      <div class="button-story" data-story="button-states" data-testid="button-state-matrix">
        <section>
          <h2>尺寸</h2>
          <div class="button-story__row">
            <SButton
              v-for="size in buttonSizes"
              :key="size"
              :size="size"
              variant="primary"
              @click="args.onClick"
            >
              {{ size }}
            </SButton>
          </div>
        </section>

        <section>
          <h2>交互状态</h2>
          <div class="button-story__row">
            <SButton disabled @click="args.onClick">禁用按钮</SButton>
            <SButton loading variant="primary" @click="args.onClick">正在提交</SButton>
          </div>
        </section>

        <section>
          <h2>块级布局</h2>
          <div class="button-story__stack">
            <SButton block variant="primary" @click="args.onClick">占满容器</SButton>
            <SButton block @click="args.onClick">次要操作</SButton>
          </div>
        </section>
      </div>
    `,
  }),
}

export const Slots: Story = {
  args: {
    onClick: fn(),
  },
  render: (args) => ({
    components: { SButton },
    setup() {
      return { args }
    },
    template: `
      <div class="button-story" data-story="button-slots">
        <section>
          <h2>图标与文本</h2>
          <div class="button-story__row">
            <SButton variant="primary" @click="args.onClick">
              <template #icon>
                <svg class="button-story__icon" viewBox="0 0 24 24">
                  <path d="M11 5h2v14h-2z" />
                  <path d="M5 11h14v2H5z" />
                </svg>
              </template>
              新建项目
            </SButton>
          </div>
        </section>
      </div>
    `,
  }),
}

export const Form: Story = {
  args: {
    variant: 'default',
  },

  render: () => ({
    components: { SButton },
    setup() {
      const projectName = ref('Serenova')
      const status = ref('尚未提交')

      function handleSubmit() {
        status.value = '已提交：' + projectName.value
      }

      function handleReset() {
        status.value = '表单已重置'
      }

      return { handleReset, handleSubmit, projectName, status }
    },
    template: `
      <div class="button-story" data-story="button-form">
        <section>
          <h2>原生表单</h2>
          <form class="button-story__form" @submit.prevent="handleSubmit" @reset="handleReset">
            <label>
              项目名称
              <input v-model="projectName" name="project-name" autocomplete="off" />
            </label>
            <div class="button-story__row">
              <SButton native-type="submit" variant="primary">提交</SButton>
              <SButton native-type="reset">重置</SButton>
            </div>
            <output>{{ status }}</output>
          </form>
        </section>
      </div>
    `,
  }),
}

export const Interaction: Story = {
  args: {
    variant: 'primary',
    onClick: fn(),
  },
  render: (args) => ({
    components: { SButton },
    setup() {
      const clickCount = ref(0)

      function handleClick(event: MouseEvent) {
        clickCount.value += 1
        args.onClick?.(event)
      }

      return { args, clickCount, handleClick }
    },
    template: `
      <div class="button-story" data-story="button-interaction">
        <SButton
          data-testid="interaction-button"
          :variant="args.variant"
          :size="args.size"
          :disabled="args.disabled"
          :loading="args.loading"
          @click="handleClick"
        >
          保存更改
        </SButton>
        <output>点击次数：{{ clickCount }}</output>
      </div>
    `,
  }),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByTestId('interaction-button')

    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
    await expect(canvas.getByText('点击次数：1')).toBeVisible()
  },
}
