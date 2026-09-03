import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'

import '@/styles/index.css'
import ButtonBrowserFixture from './fixtures/ButtonBrowser.fixture.vue'

test('禁用和加载状态阻止交互', async () => {
  const screen = await render(ButtonBrowserFixture)
  const disabled = screen.getByTestId('disabled-target')
  const loading = screen.getByTestId('loading-target')

  await expect.element(disabled).toBeDisabled()
  await expect.element(loading).toBeDisabled()

  const spinner = loading.element().querySelector<HTMLElement>('.s-button__spinner')
  expect(spinner).not.toBeNull()

  const disabledStyle = getComputedStyle(disabled.element())
  expect(disabledStyle.cursor).toBe('not-allowed')
  expect(disabledStyle.opacity).toBe('0.55')

  const spinnerStyle = getComputedStyle(spinner as HTMLElement)
  expect(spinnerStyle.width).toBe('14px')
  expect(spinnerStyle.height).toBe('14px')
  expect(spinnerStyle.borderTopWidth).toBe('2px')
})

test('保留 submit 和 reset 的原生表单行为', async () => {
  const screen = await render(ButtonBrowserFixture)

  await screen.getByTestId('submit-target').click()
  await expect.element(screen.getByTestId('submit-count')).toHaveTextContent('1')

  await screen.getByTestId('reset-target').click()
  await expect.element(screen.getByTestId('reset-count')).toHaveTextContent('1')
})

test('块级按钮采用容器可用宽度', async () => {
  const screen = await render(ButtonBrowserFixture)
  const container = screen.getByTestId('block-container').element()
  const button = screen.getByTestId('block-target').element()

  expect(getComputedStyle(button).display).toBe('flex')
  expect(button.getBoundingClientRect().width).toBe(container.getBoundingClientRect().width)
})

test('解析公共变体与尺寸的计算样式', async () => {
  const screen = await render(ButtonBrowserFixture)
  const primaryStyle = getComputedStyle(screen.getByTestId('primary-target').element())

  expect(primaryStyle.backgroundColor).toBe('rgb(21, 94, 239)')
  expect(primaryStyle.borderColor).toBe('rgb(21, 94, 239)')
  expect(primaryStyle.color).toBe('rgb(255, 255, 255)')

  const sizeContracts = [
    ['small-target', 30, '13px'],
    ['medium-target', 38, '14px'],
    ['large-target', 46, '16px'],
  ] as const

  for (const [testId, height, fontSize] of sizeContracts) {
    const button = screen.getByTestId(testId).element()

    expect(button.getBoundingClientRect().height).toBe(height)
    expect(getComputedStyle(button).fontSize).toBe(fontSize)
  }
})
