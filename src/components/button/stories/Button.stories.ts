import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  buttonSizes,
  buttonVariants,
  SButton,
  SIconAdd,
  SIconArrowRight,
  SThemeProvider,
  type ButtonProps,
} from 'serenova-ui'
import './Button.stories.css'

type ButtonStoryArgs = ButtonProps & {
  label: string
  icons: 'none' | 'prefix' | 'suffix' | 'both'
  onClick: ReturnType<typeof fn<(event: MouseEvent) => void>>
}

const variantLabels = {
  primary: '主按钮',
  warning: '警告',
  success: '成功',
  error: '错误',
  text: '文字',
}
const sizeLabels = { small: 'Small · 28 px', medium: 'Medium · 34 px', large: 'Large · 40 px' }
const matrixParameters = { controls: { disable: true } }

const meta = {
  id: 'components-button',
  title: '组件/Button',
  component: SButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '原生按钮组件，支持五种类型、三档尺寸、Ghost、图标、禁用与加载。Tab 聚焦后可用 Enter 或 Space 激活。nativeType 支持 button（默认）、submit、reset，并保留原生表单行为。',
      },
    },
    controls: {
      include: ['variant', 'size', 'ghost', 'iconOnly', 'disabled', 'loading', 'label', 'icons'],
    },
  },
  argTypes: {
    variant: { control: 'select', options: buttonVariants, description: '按钮的视觉类型。' },
    size: { control: 'select', options: buttonSizes, description: '按钮尺寸。' },
    ghost: {
      control: 'boolean',
      description: '透明底描边；文字按钮不适用。',
      if: { arg: 'variant', neq: 'text' },
    },
    iconOnly: { control: 'boolean', description: '正方形纯图标按钮。' },
    disabled: { control: 'boolean', description: '禁用交互。' },
    loading: { control: 'boolean', description: '显示加载反馈并阻止重复操作。' },
    nativeType: { control: false, description: '原生 type：button、submit、reset，默认 button。' },
    label: {
      control: 'text',
      description: '展示文案，仅用于 Story。',
      if: { arg: 'iconOnly', truthy: false },
    },
    icons: {
      control: 'select',
      options: ['none', 'prefix', 'suffix', 'both'],
      description: '图标位置，仅用于 Story；纯图标模式固定显示新增图标。',
      if: { arg: 'iconOnly', truthy: false },
    },
    onClick: { control: false, description: '可用时发出携带原生 MouseEvent 的 click。' },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    nativeType: 'button',
    ghost: false,
    iconOnly: false,
    disabled: false,
    loading: false,
    label: '保存更改',
    icons: 'none',
    onClick: fn<(event: MouseEvent) => void>(),
  },
  render: (args) => ({
    components: { SButton, SIconAdd, SIconArrowRight },
    setup() {
      // 展示辅助参数不透传给公共组件。
      const buttonProps = computed<ButtonProps>(() => ({
        variant: args.variant,
        size: args.size,
        ghost: args.ghost,
        iconOnly: args.iconOnly,
        disabled: args.disabled,
        loading: args.loading,
        nativeType: args.nativeType,
      }))
      const showPrefix = computed(
        () => args.iconOnly || args.icons === 'prefix' || args.icons === 'both',
      )
      const showSuffix = computed(
        () => !args.iconOnly && (args.icons === 'suffix' || args.icons === 'both'),
      )
      return { args, buttonProps, showPrefix, showSuffix }
    },
    template: `<SButton v-bind="buttonProps" @click="args.onClick">
      <template v-if="showPrefix" #icon><SIconAdd /></template>
      {{ args.label }}
      <template v-if="showSuffix" #suffixIcon><SIconArrowRight /></template>
    </SButton>`,
  }),
} satisfies Meta<ButtonStoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: '基础用法' }

export const Appearance: Story = {
  name: '类型与外观',
  parameters: matrixParameters,
  render: () => ({
    components: { SButton },
    setup: () => ({ buttonVariants, variantLabels }),
    template: `<div class="button-story">
      <p>默认展示 Medium。悬停查看反馈，按住鼠标查看按下状态，使用 Tab 查看键盘焦点。</p>
      <div class="button-story__scroll"><table class="button-story__matrix">
        <thead><tr><th>类型</th><th>默认</th><th>Ghost</th></tr></thead>
        <tbody><tr v-for="variant in buttonVariants" :key="variant">
          <th>{{ variantLabels[variant] }} · {{ variant }}</th>
          <td><SButton :variant="variant">继续</SButton></td>
          <td><SButton v-if="variant !== 'text'" :variant="variant" ghost>继续</SButton><span v-else>不适用</span></td>
        </tr></tbody>
      </table></div>
    </div>`,
  }),
}

export const Sizes: Story = {
  name: '尺寸',
  parameters: matrixParameters,
  render: () => ({
    components: { SButton },
    setup: () => ({ buttonSizes, sizeLabels }),
    template: `<div class="button-story"><div class="button-story__row">
      <div v-for="size in buttonSizes" :key="size" class="button-story__sample">
        <SButton :size="size">继续</SButton><p>{{ sizeLabels[size] }}</p>
      </div>
    </div></div>`,
  }),
}

export const DisabledAndLoading: Story = {
  name: '禁用与加载',
  parameters: matrixParameters,
  render: () => ({
    components: { SButton },
    setup: () => ({ buttonVariants, variantLabels }),
    template: `<div class="button-story">
      <p>加载沿用禁用配色并阻止重复操作，保留原有文字；Ghost 保持透明底色。</p>
      <div class="button-story__scroll"><table class="button-story__matrix">
        <thead><tr><th>类型</th><th>禁用</th><th>加载</th><th>Ghost 加载</th></tr></thead>
        <tbody><tr v-for="variant in buttonVariants" :key="variant">
          <th>{{ variantLabels[variant] }}</th>
          <td><SButton :variant="variant" disabled>继续</SButton></td>
          <td><SButton :variant="variant" loading>继续</SButton></td>
          <td><SButton v-if="variant !== 'text'" :variant="variant" ghost loading>继续</SButton><span v-else>不适用</span></td>
        </tr></tbody>
      </table></div>
    </div>`,
  }),
}

export const Icons: Story = {
  name: '图标用法',
  parameters: matrixParameters,
  render: () => ({
    components: { SButton, SIconAdd, SIconArrowRight },
    setup: () => ({ buttonVariants, variantLabels, buttonSizes, sizeLabels }),
    template: `<div class="button-story">
      <p>前后图标可独立设置。纯图标按钮为正方形，沿用对应类型的状态和点击反馈。</p>
      <div class="button-story__scroll"><table class="button-story__matrix">
        <thead><tr><th>类型</th><th>前置图标</th><th>后置图标</th><th>前后图标</th><th>纯图标</th><th>Ghost 纯图标</th></tr></thead>
        <tbody><tr v-for="variant in buttonVariants" :key="variant">
          <th>{{ variantLabels[variant] }}</th>
          <td><SButton :variant="variant"><template #icon><SIconAdd /></template>新增</SButton></td>
          <td><SButton :variant="variant">继续<template #suffixIcon><SIconArrowRight /></template></SButton></td>
          <td><SButton :variant="variant"><template #icon><SIconAdd /></template>新增<template #suffixIcon><SIconArrowRight /></template></SButton></td>
          <td><SButton :variant="variant" icon-only title="新增"><template #icon><SIconAdd /></template></SButton></td>
          <td><SButton v-if="variant !== 'text'" :variant="variant" ghost icon-only title="新增"><template #icon><SIconAdd /></template></SButton><span v-else>不适用</span></td>
        </tr></tbody>
      </table></div>
      <section><h2>纯图标尺寸与状态</h2><div class="button-story__row">
        <div v-for="size in buttonSizes" :key="size" class="button-story__sample">
          <SButton :size="size" icon-only title="新增"><template #icon><SIconAdd /></template></SButton><p>{{ sizeLabels[size] }}</p>
        </div>
        <div class="button-story__sample"><SButton icon-only disabled title="新增"><template #icon><SIconAdd /></template></SButton><p>禁用</p></div>
        <div class="button-story__sample"><SButton icon-only loading title="正在新增" /><p>加载</p></div>
        <div class="button-story__sample"><SButton icon-only ghost loading title="正在新增" /><p>Ghost 加载</p></div>
      </div></section>
    </div>`,
  }),
}

export const Interaction: Story = {
  name: '交互反馈',
  parameters: { controls: { include: ['variant', 'size', 'disabled', 'loading', 'ghost'] } },
  render: (args) => ({
    components: { SButton, SThemeProvider },
    setup() {
      const clickCount = ref(0)
      function handleClick(event: MouseEvent) {
        clickCount.value += 1
        args.onClick(event)
      }
      return { args, clickCount, handleClick }
    },
    template: `<div class="button-story">
      <section>
        <p>用鼠标点击，或 Tab 聚焦后按 Enter、Space；每次有效激活计数一次。禁用和加载不触发操作。</p>
        <div class="button-story__row"><SButton data-testid="interaction-button"
          :variant="args.variant" :size="args.size" :ghost="args.ghost"
          :disabled="args.disabled" :loading="args.loading" @click="handleClick">保存更改</SButton>
          <span>点击次数：<output data-testid="click-count">{{ clickCount }}</output></span></div>
        <p>语义按钮的外环在 600 ms 内扩散 5 px 并淡出；文字按钮不产生波纹。</p>
      </section>
      <section><h2>浅色局部覆盖</h2><p>局部主色只影响提供者内的按钮。</p><div class="button-story__row">
        <SButton>默认主色</SButton>
        <SThemeProvider :tokens="{ common: { colorPrimary: '#2563eb', colorPrimaryHover: '#1d4ed8', colorPrimaryPressed: '#1e40af' } }">
          <SButton>局部主色</SButton>
        </SThemeProvider>
      </div></section>
    </div>`,
  }),
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
