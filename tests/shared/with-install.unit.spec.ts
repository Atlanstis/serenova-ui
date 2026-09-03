import { createApp, defineComponent, h } from 'vue'
import { describe, expect, expectTypeOf, it } from 'vitest'

import { withInstall, type WithInstall } from '@/shared/with-install'

describe('withInstall', () => {
  it('注册组件并保留组件类型', () => {
    const Fixture = defineComponent({
      name: 'FixtureComponent',
      props: {
        label: {
          type: String,
          required: true,
        },
      },
      setup(props) {
        return () => h('span', props.label)
      },
    })
    const InstallableFixture = withInstall(Fixture)
    const app = createApp({})

    app.use(InstallableFixture)

    expect(app.component('FixtureComponent')).toBe(Fixture)
    expectTypeOf(InstallableFixture).toEqualTypeOf<WithInstall<typeof Fixture>>()
  })

  it('拒绝注册没有名称的组件', () => {
    const Anonymous = defineComponent({
      setup: () => () => h('span'),
    })

    expect(() => withInstall(Anonymous).install(createApp({}))).toThrow(
      '可安装组件必须提供组件名称。',
    )
  })
})
