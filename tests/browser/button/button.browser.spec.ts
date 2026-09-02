import { expect, test } from 'vitest'
import { render } from 'vitest-browser-vue'

import '@/styles/index.css'
import ButtonBrowserFixture from './ButtonBrowserFixture.vue'

test('禁用和加载状态阻止交互', async () => {
  const screen = await render(ButtonBrowserFixture)
  const disabled = screen.getByTestId('disabled-target')
  const loading = screen.getByTestId('loading-target')

  await expect.element(disabled).toBeDisabled()
  await expect.element(loading).toBeDisabled()

  const spinner = loading.element().querySelector<HTMLElement>('.s-button__spinner')
  expect(spinner).not.toBeNull()
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
