import { mount } from '@vue/test-utils'
import { createApp, createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { describe, expect, expectTypeOf, it } from 'vitest'
import SerenovaUI, { SButton, SThemeProvider } from '@/index'
import { SButton as SingleButton } from '@/components/button'
import { SThemeProvider as SingleProvider } from '@/components/theme-provider'
import type { ThemeOverrides, ThemeProviderProps } from '@/components/theme-provider'
import { darkPreset } from '@/theme/presets/dark'
import { lightPreset } from '@/theme/presets/light'

const button = () => h(SButton, { variant: 'primary' }, () => '保存')
const background = (element: Element) =>
  (element as HTMLElement).style.getPropertyValue('--s-button-background')

describe('主题公共契约', () => {
  it('默认插槽无包装、不透传 attrs，并保留点击业务路径', async () => {
    const wrapper = mount(SThemeProvider, {
      attrs: { class: '不应透传', tabindex: 0 },
      slots: {
        default: () => [h(SButton, { onClick: () => clicks++ }, () => '一'), h('span', '二')],
      },
    })
    let clicks = 0
    expect(wrapper.findAll('button, span').map((node) => node.text())).toContain('二')
    expect(wrapper.find('div').exists()).toBe(false)
    expect(wrapper.get('button').classes()).not.toContain('不应透传')
    expect(wrapper.get('button').attributes('tabindex')).toBeUndefined()
    await wrapper.get('button').trigger('click')
    expect(clicks).toBe(1)
    expect(mount(SThemeProvider).text()).toBe('')
  })

  it('继承共享值、移除覆盖和预设切换不修改输入', async () => {
    const tokens = Object.freeze({ common: Object.freeze({ colorPrimary: '#123456' }) })
    const wrapper = mount(SThemeProvider, {
      props: { preset: darkPreset, tokens },
      slots: { default: button },
    })
    expect(background(wrapper.get('button').element)).toBe('#123456')
    await wrapper.setProps({ tokens: { common: { colorPrimary: undefined } } })
    expect(background(wrapper.get('button').element)).toBe('#84adff')
    await wrapper.setProps({ preset: lightPreset })
    expect(background(wrapper.get('button').element)).toBe('#155eef')
    expect(tokens.common.colorPrimary).toBe('#123456')
    expect(darkPreset.common.colorPrimary).toBe('#84adff')
  })

  it('内层重新派生默认值，组件覆盖优先且可重置', () => {
    const wrapper = mount(SThemeProvider, {
      props: { preset: darkPreset, tokens: { components: { Button: { borderRadius: '20px' } } } },
      slots: {
        default: () => [
          h(
            SThemeProvider,
            { tokens: { common: { colorPrimary: '#123456' } } },
            { default: button },
          ),
          h(SThemeProvider, { inherit: false }, { default: button }),
          h(SThemeProvider, { preset: lightPreset }, { default: button }),
        ],
      },
    })
    const nodes = wrapper.findAll('button').map((w) => w.element)
    expect(nodes.map(background)).toEqual(['#123456', '#155eef', '#155eef'])
    expect(nodes.map((el) => el.style.getPropertyValue('--s-button-border-radius'))).toEqual([
      '20px',
      '8px',
      '8px',
    ])
  })

  it('元素 style 覆盖公开变量，未知字段不进入主题', () => {
    const wrapper = mount(SThemeProvider, {
      props: { tokens: { common: { colorPrimary: '#123456', unknown: '错误' } } as ThemeOverrides },
      slots: {
        default: () =>
          h(
            SButton,
            { variant: 'primary', style: { '--s-button-background': '#abcdef' } },
            () => '保存',
          ),
      },
    })
    expect(background(wrapper.get('button').element)).toBe('#abcdef')
    expect(wrapper.html()).not.toContain('错误')
  })

  it('根入口和单组件入口一致且支持安装', () => {
    expect(SingleProvider).toBe(SThemeProvider)
    expect(SingleButton).toBe(SButton)
    for (const plugin of [SerenovaUI, SingleProvider]) {
      const app = createApp({})
      app.use(plugin)
      expect(app.component('SThemeProvider')).toBe(SThemeProvider)
    }
    expectTypeOf<ThemeProviderProps['inherit']>().toEqualTypeOf<boolean | undefined>()
    const invalid: ThemeProviderProps = {
      // @ts-expect-error null 不表示主题重置。
      preset: null,
    }
    expect(invalid.preset).toBeNull()
  })

  it('服务端输出默认主题和请求隔离的主题变量', async () => {
    const themed = await renderToString(
      createSSRApp({
        render: () => h(SThemeProvider, { preset: darkPreset }, { default: button }),
      }),
    )
    const plain = await renderToString(createSSRApp({ render: button }))
    expect(themed).toContain('--s-button-background:#84adff')
    expect(plain).toContain('--s-button-background:#155eef')
    expect(plain).not.toContain('#84adff')
  })
})
