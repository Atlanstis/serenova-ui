import { createApp, defineComponent, h } from 'vue'
import { describe, expect, expectTypeOf, it } from 'vitest'

import SerenovaUI, { SButton } from '@/index'
import * as SerenovaExports from '@/index'

describe('组件公共入口', () => {
  it('允许 SButton 单组件安装', () => {
    const app = createApp({})

    app.use(SButton)

    expect(app.component('SButton')).toBe(SButton)
  })

  it('默认插件安装全部公共组件', () => {
    const app = createApp(
      defineComponent({
        render: () => h('div'),
      }),
    )

    app.use(SerenovaUI)

    expect(app.component('SButton')).toBe(SButton)
  })

  it('不从包根入口暴露内部组件注册表', () => {
    expect(SerenovaExports).not.toHaveProperty('components')
  })
})

it('根与单组件入口公开收敛后的类型', () => {
  expectTypeOf<import('@/index').ButtonProps>().toEqualTypeOf<
    import('@/components/button').ButtonProps
  >()
  expectTypeOf<import('@/components/button').ButtonProps>().not.toHaveProperty('block')
  expectTypeOf<import('@/index').ButtonThemeTokens>().not.toHaveProperty('ghostColorText')
  expectTypeOf<import('@/index').ButtonThemeTokens>().toEqualTypeOf<
    import('@/components/theme-provider').ButtonThemeTokens
  >()
  expectTypeOf<import('@/components/button').ButtonNativeType>().toEqualTypeOf<
    'button' | 'submit' | 'reset'
  >()
})

it('根与单组件出口均支持 text 与语义类型组合', () => {
  expectTypeOf<import('@/index').ButtonProps>()
    .toHaveProperty('text')
    .toEqualTypeOf<boolean | undefined>()
  expectTypeOf<import('@/components/button').ButtonProps>()
    .toHaveProperty('text')
    .toEqualTypeOf<boolean | undefined>()
  expectTypeOf<import('@/index').ButtonThemeTokens>().not.toHaveProperty('textColorText')
  expectTypeOf<import('@/index').ButtonThemeTokens>().toHaveProperty('textButtonColorError')
})
