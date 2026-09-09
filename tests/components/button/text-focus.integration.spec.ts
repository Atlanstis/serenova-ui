import { expect, test } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-vue'
import Fixture from './fixtures/TextButtonRow.fixture.vue'

// 焦点伪元素属于可观察的绘制结果；几何断言不依赖组件内部状态。
test('三档文字按钮焦点环内侧四周留白为 4px，聚焦不改变排列尺寸', async () => {
  const screen = await render(Fixture)
  for (const [size, height] of [
    ['small', 28],
    ['medium', 34],
    ['large', 40],
  ] as const) {
    const row = screen.getByTestId(size)
    const target = row.getByRole('button', { name: '编辑', exact: true })
    const button = target.element()
    const before = button.getBoundingClientRect()
    const nextBefore = row
      .getByRole('button', { name: '查看详情' })
      .element()
      .getBoundingClientRect()
    await target.click()
    await userEvent.keyboard('{Enter}')
    const bounds = button.getBoundingClientRect()
    const style = getComputedStyle(button)
    const ring = getComputedStyle(button, '::after')
    const stroke = parseFloat(ring.borderLeftWidth)
    const left = bounds.left + parseFloat(ring.left)
    const top = bounds.top + parseFloat(ring.top) - parseFloat(ring.height) / 2
    const contentTop = bounds.top + (bounds.height - parseFloat(style.lineHeight)) / 2
    expect(ring.content).toBe('""')
    expect(ring.pointerEvents).toBe('none')
    expect(ring.height).toBe('32px')
    expect(ring.borderRadius).toBe('9px')
    expect(ring.borderColor).toBe('rgb(150, 114, 208)')
    expect(bounds.left - left - stroke).toBeCloseTo(4, 1)
    expect(left + parseFloat(ring.width) - stroke - bounds.right).toBeCloseTo(4, 1)
    expect(contentTop - top - stroke).toBeCloseTo(4, 1)
    expect(
      top + parseFloat(ring.height) - stroke - contentTop - parseFloat(style.lineHeight),
    ).toBeCloseTo(4, 1)
    expect(bounds.height).toBe(height)
    expect(bounds.width).toBe(before.width)
    expect(
      row.getByRole('button', { name: '查看详情' }).element().getBoundingClientRect().left,
    ).toBe(nextBefore.left)
    await userEvent.tab()
    expect(getComputedStyle(button, '::after').content).toBe('none')
  }
})

test('纯图标文字按钮和普通按钮继续沿用原生焦点环', async () => {
  const screen = await render(Fixture)
  for (const name of ['保存', '编辑图标']) {
    const target = screen.getByTestId('medium').getByRole('button', { name, exact: true })
    await target.click()
    await userEvent.keyboard('{Enter}')
    const style = getComputedStyle(target.element())
    expect(style.outlineWidth).toBe('2px')
    expect(style.outlineOffset).toBe('2px')
    expect(getComputedStyle(target.element(), '::after').content).toBe('none')
  }
})
