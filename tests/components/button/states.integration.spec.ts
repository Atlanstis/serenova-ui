import { expect, test } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-vue'
import Fixture from './fixtures/ButtonStates.fixture.vue'
import ThemeFixture from './fixtures/ButtonTheme.fixture.vue'

test('文字和四种语义 Ghost 主题覆盖继续影响实际外观', async () => {
  const screen = await render(ThemeFixture)
  const colors = {
    text: 'rgb(18, 52, 86)',
    primary: 'rgb(35, 69, 103)',
    warning: 'rgb(52, 86, 120)',
    success: 'rgb(69, 103, 137)',
    error: 'rgb(86, 120, 154)',
  }
  for (const [name, color] of Object.entries(colors)) {
    const style = getComputedStyle(screen.getByRole('button', { name, exact: true }).element())
    expect(style.color).toBe(color)
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(style.borderColor).toBe(name === 'text' ? 'rgba(0, 0, 0, 0)' : color)
  }
})

test('Figma 状态颜色、Ghost 与纯图标尺寸', async () => {
  const screen = await render(Fixture)
  const get = (id: string) => getComputedStyle(screen.getByTestId(id).element())
  const rows = [
    ['primary', 'rgb(124, 58, 237)', 'rgb(170, 146, 205)', 'rgb(109, 40, 217)'],
    ['warning', 'rgb(240, 180, 41)', 'rgb(223, 197, 139)', 'rgb(240, 180, 41)'],
    ['success', 'rgb(52, 178, 123)', 'rgb(147, 203, 178)', 'rgb(52, 178, 123)'],
    ['error', 'rgb(240, 100, 104)', 'rgb(230, 171, 174)', 'rgb(240, 100, 104)'],
  ] as const
  for (const [id, normal, disabled, ghost] of rows) {
    expect(get(id).backgroundColor).toBe(normal)
    expect(get(id).borderRadius).toBe('6px')
    expect(get(id).fontSize).toBe('14px')
    expect(get(id).fontWeight).toBe('500')
    expect(get(id).lineHeight).toBe('20px')
    expect(get(id + '-disabled').backgroundColor).toBe(disabled)
    expect(get(id + '-disabled').color).toBe('rgb(255, 255, 255)')
    expect(get(id + '-ghost').backgroundColor).toBe('rgba(0, 0, 0, 0)')
    expect(get(id + '-ghost').color).toBe(ghost)
    expect(get(id + '-ghost').borderColor).toBe(ghost)
    expect(get(id + '-ghost-loading').color).toBe(disabled)
  }
  expect(get('text-disabled').color).toBe('rgb(164, 140, 191)')
  for (const [size, dimension] of [
    ['small', 28],
    ['medium', 34],
    ['large', 40],
  ] as const) {
    const el = screen.getByTestId(size + '-icon').element()
    expect(el.getBoundingClientRect().width).toBe(dimension)
    expect(el.getBoundingClientRect().height).toBe(dimension)
    expect(getComputedStyle(el.querySelector('svg')!).width).toBe('16px')
  }
})

test('鼠标键盘一致、焦点环和波纹生命周期', async () => {
  const screen = await render(Fixture)
  const target = screen.getByTestId('target')
  const el = target.element()
  const wave = () => el.querySelector('.s-button__wave')
  const bounds = el.getBoundingClientRect()
  await target.click()
  await expect.element(screen.getByRole('status')).toHaveTextContent('1')
  expect(wave()).not.toBeNull()
  const firstWave = wave()
  await userEvent.keyboard('{Enter}')
  await expect.element(screen.getByRole('status')).toHaveTextContent('2')
  expect(wave()).not.toBe(firstWave)
  expect(getComputedStyle(el).outlineWidth).toBe('2px')
  expect(getComputedStyle(el).outlineColor).toBe('rgb(150, 114, 208)')
  await userEvent.keyboard(' ')
  await expect.element(screen.getByRole('status')).toHaveTextContent('3')
  expect(getComputedStyle(wave()!).animationDuration).toBe('0.6s')
  expect(getComputedStyle(el).getPropertyValue('--s-button-wave-spread')).toBe('5px')
  expect(el.getBoundingClientRect().width).toBe(bounds.width)
  await expect.poll(wave).toBeNull()
  await target.click()
  await screen.getByRole('button', { name: '禁用切换' }).click()
  await expect.element(target).toBeDisabled()
  expect(wave()).toBeNull()
  await screen.getByRole('button', { name: '禁用切换' }).click()
  await target.click()
  await screen.getByRole('button', { name: '加载切换' }).click()
  expect(wave()).toBeNull()
  expect(el.querySelectorAll('svg')).toHaveLength(1)
  expect(getComputedStyle(el.querySelector('.s-button__spinner')!).animationDuration).toBe('0.8s')
  await screen.getByRole('button', { name: '加载切换' }).click()
  expect(el.querySelectorAll('svg')).toHaveLength(2)
  await screen.getByTestId('text').click()
  expect(screen.getByTestId('text').element().querySelector('.s-button__wave')).toBeNull()
})

test('悬停与按下使用独立状态色，文字按钮显示下划线', async () => {
  const screen = await render(Fixture)
  const target = screen.getByTestId('error')
  await target.hover()
  await expect
    .poll(() => getComputedStyle(target.element()).backgroundColor)
    .toBe('rgb(223, 83, 89)')
  await target.click()
  await userEvent.keyboard('{Space>}')
  await expect
    .poll(() => getComputedStyle(target.element()).backgroundColor)
    .toBe('rgb(201, 68, 75)')
  await userEvent.keyboard('{/Space}')
  const text = screen.getByTestId('text')
  await text.hover()
  expect(
    getComputedStyle(text.element().querySelector('.s-button__content')!).textDecorationLine,
  ).toBe('underline')
})
