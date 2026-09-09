import { expect, test } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-vue'
import Fixture from './fixtures/TextVariants.fixture.vue'

const colors = [
  ['primary', 'rgb(109, 40, 217)', 'rgb(109, 40, 217)', 'rgb(91, 33, 182)', 'rgb(164, 140, 191)'],
  ['warning', 'rgb(240, 180, 41)', 'rgb(222, 164, 29)', 'rgb(197, 142, 18)', 'rgb(223, 197, 139)'],
  ['success', 'rgb(52, 178, 123)', 'rgb(41, 159, 108)', 'rgb(33, 136, 92)', 'rgb(147, 203, 178)'],
  ['error', 'rgb(240, 100, 104)', 'rgb(223, 83, 89)', 'rgb(201, 68, 75)', 'rgb(230, 171, 174)'],
] as const

test.each(colors)(
  '%s 文字按钮的语义配色、优先级、加载和输入行为',
  async (variant, normal, hover, pressed, disabled) => {
    const screen = await render(Fixture)
    const target = screen.getByTestId(variant)
    const style = () => getComputedStyle(target.element())
    expect(style().color).toBe(normal)
    expect(style().backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(style().borderWidth).toBe('0px')
    expect(style().boxShadow).toBe('none')
    expect(getComputedStyle(screen.getByTestId(`${variant}-disabled`).element()).color).toBe(
      disabled,
    )
    await target.hover()
    await expect.poll(() => style().color).toBe(hover)
    await target.click()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard('{Space>}')
    await expect.poll(() => style().color).toBe(pressed)
    await userEvent.keyboard('{/Space}')
    await expect.element(screen.getByRole('status')).toHaveTextContent('3')
    expect(target.element().querySelector('.s-button__wave')).toBeNull()
    expect(getComputedStyle(target.element(), '::after').borderWidth).toBe('2px')
    expect(getComputedStyle(target.element(), '::after').borderColor).toBe(
      variant === 'primary' ? 'rgb(150, 114, 208)' : normal,
    )
    expect(getComputedStyle(target.element(), '::after').height).toBe('32px')
    await screen.getByRole('button', { name: '切换加载' }).click()
    await expect.element(target).toBeDisabled()
    await expect.poll(() => style().color).toBe(disabled)
    expect(style().backgroundColor).toBe('rgba(0, 0, 0, 0)')
    await screen.getByRole('button', { name: '切换加载' }).click()
    await screen.getByRole('button', { name: '切换文字' }).click()
    expect(style().borderWidth).toBe('1px')
    expect(style().minWidth).toBe('80px')
  },
)

test('文字主题颜色可独立覆盖四种状态，且不影响其他语义类型', async () => {
  const screen = await render(Fixture, {
    props: {
      tokens: {
        components: {
          Button: {
            textButtonColorError: '#123456',
            textButtonColorHoverError: '#234567',
            textButtonColorPressedError: '#345678',
            textButtonColorDisabledError: '#456789',
          },
        },
      },
    },
  })
  const target = screen.getByTestId('error')
  expect(getComputedStyle(target.element()).color).toBe('rgb(18, 52, 86)')
  expect(getComputedStyle(screen.getByTestId('warning').element()).color).toBe(colors[1][1])
  await target.hover()
  await expect.poll(() => getComputedStyle(target.element()).color).toBe('rgb(35, 69, 103)')
  await target.click()
  await userEvent.keyboard('{Space>}')
  await expect.poll(() => getComputedStyle(target.element()).color).toBe('rgb(52, 86, 120)')
  await userEvent.keyboard('{/Space}')
  expect(getComputedStyle(screen.getByTestId('error-disabled').element()).color).toBe(
    'rgb(69, 103, 137)',
  )
})
