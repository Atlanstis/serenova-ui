import { expect, test } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-vue'
import Fixture from './fixtures/Icons.fixture.vue'

test('六个图标独立尺寸、颜色继承、动态覆盖及多实例', async () => {
  const screen = await render(Fixture)
  const names = ['Add', 'Delete', 'Edit', 'Search', 'ArrowRight', 'Loading']
  const style = (name: string) => getComputedStyle(screen.getByTestId(`SIcon${name}`).element())
  for (const name of names) {
    expect(style(name).width).toBe('16px')
    expect(style(name).height).toBe('16px')
    expect(style(name).color).toBe('rgb(12, 34, 56)')
    expect(
      getComputedStyle(screen.getByTestId(`SIcon${name}`).element().querySelector('path')!).stroke,
    ).toBe('rgb(12, 34, 56)')
  }
  expect(getComputedStyle(screen.getByTestId('duplicate').element()).width).toBe('24px')
  await screen.getByRole('button', { name: '切换图标' }).click()
  for (const name of names) {
    expect(style(name).width).toBe('20px')
    expect(style(name).color).toBe('rgb(101, 67, 33)')
  }
  await userEvent.tab()
  await expect.element(screen.getByRole('button', { name: '下一项' })).toHaveFocus()
  await screen.getByRole('button', { name: '切换图标' }).click()
  expect(style('Add').color).toBe('rgb(12, 34, 56)')
})
