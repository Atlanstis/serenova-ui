import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'

import ButtonIntegrationFixture from './fixtures/ButtonIntegration.fixture.vue'

test('禁用和加载状态阻止交互', async () => {
  const screen = await render(ButtonIntegrationFixture)
  const disabled = screen.getByTestId('disabled-target')
  const loading = screen.getByTestId('loading-target')

  await expect.element(disabled).toBeDisabled()
  await expect.element(loading).toBeDisabled()

  const spinner = loading.element().querySelector<HTMLElement>('.s-button__spinner')
  expect(spinner).not.toBeNull()

  const disabledStyle = getComputedStyle(disabled.element())
  expect(disabledStyle.cursor).toBe('not-allowed')
  expect(disabledStyle.opacity).toBe('1')

  const spinnerStyle = getComputedStyle(spinner as HTMLElement)
  expect(spinnerStyle.width).toBe('16px')
  expect(spinnerStyle.height).toBe('16px')
  expect(spinnerStyle.animationDuration).toBe('0.8s')
})

test('保留 submit 和 reset 的原生表单行为', async () => {
  const screen = await render(ButtonIntegrationFixture)

  await screen.getByTestId('submit-target').click()
  await expect.element(screen.getByTestId('submit-count')).toHaveTextContent('1')

  await screen.getByTestId('reset-target').click()
  await expect.element(screen.getByTestId('reset-count')).toHaveTextContent('1')
})

test('块级按钮采用容器可用宽度', async () => {
  const screen = await render(ButtonIntegrationFixture)
  const container = screen.getByTestId('block-container').element()
  const button = screen.getByTestId('block-target').element()

  expect(getComputedStyle(button).display).toBe('flex')
  expect(button.getBoundingClientRect().width).toBe(container.getBoundingClientRect().width)
})

test('解析公共变体与尺寸的计算样式', async () => {
  const screen = await render(ButtonIntegrationFixture)
  const primaryStyle = getComputedStyle(screen.getByTestId('primary-target').element())

  expect(primaryStyle.backgroundColor).toBe('rgb(124, 58, 237)')
  expect(primaryStyle.borderColor).toBe('rgb(124, 58, 237)')
  expect(primaryStyle.color).toBe('rgb(255, 255, 255)')

  const sizeContracts = [
    ['small-target', 28, '14px'],
    ['medium-target', 34, '14px'],
    ['large-target', 40, '14px'],
  ] as const

  for (const [testId, height, fontSize] of sizeContracts) {
    const button = screen.getByTestId(testId).element()

    expect(button.getBoundingClientRect().height).toBe(height)
    expect(getComputedStyle(button).fontSize).toBe(fontSize)
  }
})
