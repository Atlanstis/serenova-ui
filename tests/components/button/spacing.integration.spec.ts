import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'
import { userEvent } from 'vitest/browser'
import TextButtonRow from './fixtures/TextButtonRow.fixture.vue'
import Fixture from './fixtures/ButtonSpacing.fixture.vue'

test.each(
  ([true, false] as const).flatMap((text) =>
    (['primary', 'warning', 'success', 'error'] as const).map((variant) => ({ text, variant })),
  ),
)(
  '$variant text=$text 图标与文字保持 Figma 的 8px 间距及三档水平留白',
  async ({ variant, text }) => {
    const screen = await render(Fixture, { props: { variant, text } })
    for (const [size, padding, minWidth] of [
      ['small', 12, 64],
      ['medium', 16, 80],
      ['large', 20, 96],
    ] as const) {
      for (const layout of ['text', 'prefix', 'suffix', 'both', 'loading']) {
        const button = screen.getByTestId(`${size}-${layout}`).element()
        const bounds = button.getBoundingClientRect()
        const label = button.querySelector('[data-testid="label"]')!.getBoundingClientRect()
        const icons = [...button.querySelectorAll('svg')].map((icon) =>
          icon.getBoundingClientRect(),
        )
        const prefix = layout === 'suffix' ? undefined : icons[0]
        const suffix = layout === 'suffix' ? icons[0] : layout === 'both' ? icons[1] : undefined
        if (prefix) expect(label.left - prefix.right).toBeCloseTo(8, 1)
        if (suffix) expect(suffix.left - label.right).toBeCloseTo(8, 1)
        const contentWidth = label.width + icons.length * 24
        expect(bounds.width).toBeCloseTo(
          text ? contentWidth : Math.max(minWidth, contentWidth + padding * 2),
          1,
        )
        expect((prefix ?? label).left - bounds.left).toBeCloseTo(
          bounds.right - (suffix ?? label).right,
          1,
        )
      }
    }
  },
)

test('Ghost 与主题覆盖保持实际图标间距和水平留白', async () => {
  const screen = await render(Fixture, {
    props: {
      ghost: true,
      tokens: { components: { Button: { gap: '10px', paddingMedium: '18px' } } },
    },
  })
  const button = screen.getByTestId('medium-both').element()
  const bounds = button.getBoundingClientRect()
  const prefix = button.querySelector('[data-testid="prefix"]')!.getBoundingClientRect()
  const label = button.querySelector('[data-testid="label"]')!.getBoundingClientRect()
  const suffix = button.querySelector('[data-testid="suffix"]')!.getBoundingClientRect()
  expect(label.left - prefix.right).toBeCloseTo(10, 1)
  expect(suffix.left - label.right).toBeCloseTo(10, 1)
  expect(prefix.left - bounds.left).toBeCloseTo(18, 1)
  expect(bounds.right - suffix.right).toBeCloseTo(18, 1)
})

test('混合排列保留普通按钮最小宽度，文字操作之间仅保留容器间距', async () => {
  const screen = await render(TextButtonRow)
  for (const [size, minWidth, height] of [
    ['small', 64, 28],
    ['medium', 80, 34],
    ['large', 96, 40],
  ] as const) {
    const row = screen.getByTestId(size).element()
    const buttons = [...row.querySelectorAll('button')]
    expect(buttons[0]!.getBoundingClientRect().width).toBe(minWidth)
    expect(buttons[1]!.getBoundingClientRect().width).toBe(minWidth)
    const edit = buttons[2]!.querySelector('span')!.getBoundingClientRect()
    const details = buttons[3]!.querySelector('span')!.getBoundingClientRect()
    expect(details.left - edit.right).toBeCloseTo(16, 1)
    for (const button of buttons.slice(2, 6)) {
      expect(getComputedStyle(button).paddingLeft).toBe('0px')
      expect(getComputedStyle(button).paddingRight).toBe('0px')
      expect(button.getBoundingClientRect().height).toBe(height)
    }
    expect(buttons[6]!.getBoundingClientRect().width).toBe(height)
  }
  const edit = screen.getByTestId('medium').getByRole('button', { name: '编辑', exact: true })
  await edit.click()
  await expect.element(screen.getByRole('status')).toHaveTextContent('1')
  await userEvent.keyboard('{Enter}')
  await expect.element(screen.getByRole('status')).toHaveTextContent('2')
  await userEvent.keyboard(' ')
  await expect.element(screen.getByRole('status')).toHaveTextContent('3')
  expect(getComputedStyle(edit.element(), '::after').borderWidth).toBe('2px')
})
