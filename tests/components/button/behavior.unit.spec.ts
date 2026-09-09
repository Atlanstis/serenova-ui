import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Button from '@/components/button/src/Button.vue'

describe('SButton', () => {
  it('以默认外观和原生 button 类型渲染', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '保存',
      },
    })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.classes()).toContain('s-button--primary')
    expect(wrapper.classes()).toContain('s-button--medium')
    expect(wrapper.get('.s-button__content').text()).toBe('保存')
  })

  it.each([
    ['variant', 'primary', 's-button--primary'],
    ['size', 'large', 's-button--large'],
  ] as const)('把 %s 映射到公共 class', (prop, value, className) => {
    const wrapper = mount(Button, {
      props: { [prop]: value },
    })

    expect(wrapper.classes()).toContain(className)
  })

  it('按图标、内容顺序渲染插槽', () => {
    const wrapper = mount(Button, {
      slots: {
        icon: '<svg data-icon="add" />',
        default: '新建',
      },
    })

    const children = wrapper.findAll('.s-button__icon, .s-button__content')
    expect(children[0]?.classes()).toContain('s-button__icon')
    expect(children[1]?.classes()).toContain('s-button__content')
    expect(wrapper.find('[data-icon="add"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('新建')
  })

  it('透传原生属性、data、class 和 style', () => {
    const wrapper = mount(Button, {
      attrs: {
        'data-testid': 'add-button',
        class: 'consumer-class',
        form: 'editor-form',
        name: 'intent',
        style: 'margin-top: 4px;',
      },
      slots: {
        icon: '<svg />',
      },
    })

    expect(wrapper.attributes('data-testid')).toBe('add-button')
    expect(wrapper.attributes('form')).toBe('editor-form')
    expect(wrapper.attributes('name')).toBe('intent')
    expect(wrapper.classes()).toContain('consumer-class')
    expect(wrapper.attributes('style')).toContain('margin-top: 4px')
  })

  it('可用时恰好发出一次携带 MouseEvent 的 click', async () => {
    const wrapper = mount(Button)

    await wrapper.trigger('click')

    const clicks = wrapper.emitted('click')
    expect(clicks).toHaveLength(1)
    expect(clicks?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })

  it.each([
    { disabled: true, loading: false },
    { disabled: false, loading: true },
  ])('在 disabled=$disabled loading=$loading 时阻止 click', async (props) => {
    const wrapper = mount(Button, { props })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(wrapper.attributes()).toHaveProperty('disabled')
  })

  it('加载时呈现加载状态并保留内容', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: '提交订单' },
    })

    expect(wrapper.classes()).toContain('s-button--loading')
    expect(wrapper.find('.s-button__spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('提交订单')
  })

  it('响应状态更新', async () => {
    const wrapper = mount(Button, {
      props: { loading: true, variant: 'primary' },
    })

    await wrapper.setProps({ loading: false, variant: 'success' })

    expect(wrapper.attributes('disabled')).toBeUndefined()
    expect(wrapper.classes()).not.toContain('s-button--primary')
    expect(wrapper.classes()).toContain('s-button--success')
  })

  it.each(['submit', 'reset'] as const)('将 nativeType=%s 映射到原生 type', (nativeType) => {
    const wrapper = mount(Button, { props: { nativeType } })

    expect(wrapper.attributes('type')).toBe(nativeType)
  })
})

it('前后图标、加载替换和纯图标组合保持内容契约', async () => {
  const wrapper = mount(Button, {
    slots: {
      icon: '<svg data-testid="prefix" />',
      default: '保存',
      suffixIcon: '<svg data-testid="suffix" />',
    },
  })
  expect(wrapper.findAll('svg').map((n) => n.attributes('data-testid'))).toEqual([
    'prefix',
    'suffix',
  ])
  expect(wrapper.text()).toBe('保存')
  await wrapper.setProps({ loading: true, disabled: true })
  expect(wrapper.find('[data-testid="prefix"]').exists()).toBe(false)
  expect(wrapper.find('[data-testid="suffix"]').exists()).toBe(false)
  expect(wrapper.findAll('svg')).toHaveLength(1)
  expect(wrapper.text()).toBe('保存')
  await wrapper.setProps({ loading: false, disabled: false, iconOnly: true })
  expect(wrapper.find('[data-testid="prefix"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="suffix"]').exists()).toBe(false)
  expect(wrapper.text()).toBe('')
  await wrapper.setProps({ iconOnly: false, variant: 'text', ghost: true })
  expect(wrapper.classes()).not.toContain('s-button--ghost')
})

it('空槽不生成业务占位，可用五种变体均响应更新', async () => {
  const wrapper = mount(Button)
  expect(wrapper.find('span').exists()).toBe(false)
  for (const variant of ['primary', 'warning', 'success', 'error', 'text'] as const) {
    await wrapper.setProps({ variant })
    expect(wrapper.classes()).toContain(`s-button--${variant}`)
  }
})
