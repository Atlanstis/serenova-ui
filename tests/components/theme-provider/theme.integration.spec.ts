import { expect, test, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-vue'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { SButton, SThemeProvider } from '@/index'
import { customPreset } from '../../support/theme-preset'
import Fixture from './fixtures/Theme.fixture.vue'

test('主题继承、重置、移除覆盖和 Teleport 使用真实样式', async () => {
  const screen = await render(Fixture)
  const style = (id: string) => getComputedStyle(page.getByTestId(id).element())
  expect(style('plain').backgroundColor).toBe('rgb(124, 58, 237)')
  expect(style('parent').backgroundColor).toBe('rgb(18, 52, 86)')
  expect(style('child').backgroundColor).toBe('rgb(101, 67, 33)')
  expect(style('child').borderRadius).toBe('20px')
  for (const id of ['reset', 'preset-reset']) {
    expect(style(id).backgroundColor).toBe('rgb(124, 58, 237)')
    expect(style(id).borderRadius).toBe('6px')
  }
  expect(style('teleported').backgroundColor).toBe(style('parent').backgroundColor)
  await screen.getByRole('textbox', { name: '保留输入' }).fill('保持')
  await screen.getByRole('button', { name: '移除覆盖', exact: true }).click()
  await expect.poll(() => style('parent').backgroundColor).toBe('rgb(132, 173, 255)')
  expect(style('parent').borderRadius).toBe('6px')
  await screen.getByRole('button', { name: '切换主题' }).click()
  await expect.poll(() => style('parent').backgroundColor).toBe('rgb(124, 58, 237)')
  expect(style('teleported').backgroundColor).toBe(style('parent').backgroundColor)
  expect(style('sibling').backgroundColor).toBe('rgb(132, 173, 255)')
  await expect.element(screen.getByRole('textbox')).toHaveValue('保持')
})

test('Provider 下鼠标和原生键盘激活复用相同点击路径', async () => {
  const screen = await render(Fixture)
  const button = screen.getByTestId('parent')
  await button.click()
  await expect.element(screen.getByTestId('count')).toHaveTextContent('1')
  await expect.element(button).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  await expect.element(screen.getByTestId('count')).toHaveTextContent('2')
  await userEvent.keyboard(' ')
  await expect.element(screen.getByTestId('count')).toHaveTextContent('3')
})

test('相同主题的 SSR 输出可无差异 hydration', async () => {
  const Root = {
    render: () =>
      h(
        SThemeProvider,
        { preset: customPreset },
        { default: () => h(SButton, { variant: 'primary' }, () => '服务端按钮') },
      ),
  }
  const container = document.createElement('div')
  container.innerHTML = await renderToString(createSSRApp(Root))
  document.body.append(container)
  const original = container.querySelector('button')!
  const error = vi.spyOn(console, 'error')
  const warn = vi.spyOn(console, 'warn')
  const app = createSSRApp(Root)
  try {
    expect(getComputedStyle(original).backgroundColor).toBe('rgb(132, 173, 255)')
    app.mount(container)
    expect(container.querySelector('button')).toBe(original)
    expect(getComputedStyle(original).backgroundColor).toBe('rgb(132, 173, 255)')
    expect(error).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  } finally {
    app.unmount()
    container.remove()
    error.mockRestore()
    warn.mockRestore()
  }
})
