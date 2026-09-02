import { createApp, defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'

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
