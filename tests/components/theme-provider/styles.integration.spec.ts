import { expect, test } from 'vitest'
import { createApp, h, onMounted, shallowRef, nextTick } from 'vue'

const rules = () => document.head.querySelectorAll('style[data-serenova-style]')

test('首次显示自动加载样式，多应用去重、局部主题隔离及重挂载', async () => {
  rules().forEach((node) => node.remove())
  const { default: SerenovaUI, SButton, SThemeProvider } = await import('@/index')
  expect(rules()).toHaveLength(0)
  const first = document.createElement('div')
  const second = document.createElement('div')
  document.body.append(first, second)
  const custom = shallowRef('#123456')
  let initial = ''
  const app = createApp({
    setup() {
      onMounted(() => {
        initial = getComputedStyle(first.querySelector('button')!).backgroundColor
      })
      return () => h(SButton, null, () => '默认')
    },
  }).use(SerenovaUI)
  const themed = createApp({
    setup: () => () =>
      h(
        SThemeProvider,
        { tokens: { common: { colorPrimary: custom.value } } },
        {
          default: () => [h(SButton, null, () => '自定义一'), h(SButton, null, () => '自定义二')],
        },
      ),
  })
  expect(rules()).toHaveLength(0)
  app.mount(first)
  themed.mount(second)
  try {
    expect(initial).toBe('rgb(124, 58, 237)')
    expect(rules()).toHaveLength(1)
    expect(getComputedStyle(second.querySelector('button')!).backgroundColor).toBe(
      'rgb(18, 52, 86)',
    )
    custom.value = '#654321'
    await nextTick()
    await expect
      .poll(() => getComputedStyle(second.querySelector('button')!).backgroundColor)
      .toBe('rgb(101, 67, 33)')
    expect(getComputedStyle(first.querySelector('button')!).backgroundColor).toBe(
      'rgb(124, 58, 237)',
    )
  } finally {
    app.unmount()
    try {
      expect(getComputedStyle(second.querySelector('button')!).backgroundColor).toBe(
        'rgb(101, 67, 33)',
      )
      expect(rules()).toHaveLength(1)
    } finally {
      themed.unmount()
    }
  }
  const remounted = createApp({ render: () => h(SButton, null, () => '再次使用') })
  remounted.mount(first)
  try {
    expect(getComputedStyle(first.querySelector('button')!).backgroundColor).toBe(
      'rgb(124, 58, 237)',
    )
    expect(rules()).toHaveLength(1)
  } finally {
    remounted.unmount()
    first.remove()
    second.remove()
  }
})
