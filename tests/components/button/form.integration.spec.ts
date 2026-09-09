import { expect, test } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-vue'
import Fixture from './fixtures/ButtonForm.fixture.vue'

test.each([undefined, 'button', 'submit', 'reset'] as const)(
  'type=%s 的鼠标与键盘激活保留原生表单行为',
  async (initialType) => {
    const screen = await render(Fixture, { props: { initialType } })
    const target = screen.getByTestId('form-target')
    const input = screen.getByRole('textbox', { name: '名称' })
    await expect.element(target).toHaveAttribute('type', initialType ?? 'button')
    for (const [index, action] of ['mouse', 'enter', 'space'].entries()) {
      await input.fill('已修改')
      if (action === 'mouse') {
        await target.click()
      } else {
        await userEvent.tab()
        await expect.element(target).toHaveFocus()
        await userEvent.keyboard(action === 'enter' ? '{Enter}' : ' ')
      }
      await expect.element(target).toHaveFocus()
      await expect.element(screen.getByTestId('clicks')).toHaveTextContent(String(index + 1))
      await expect
        .element(screen.getByTestId('submits'))
        .toHaveTextContent(String(initialType === 'submit' ? index + 1 : 0))
      await expect
        .element(screen.getByTestId('resets'))
        .toHaveTextContent(String(initialType === 'reset' ? index + 1 : 0))
      await expect.element(input).toHaveValue(initialType === 'reset' ? 'Serenova' : '已修改')
    }
  },
)

test('动态更新及移除 type 改变实际表单行为', async () => {
  const screen = await render(Fixture)
  const target = screen.getByTestId('form-target')
  const input = screen.getByRole('textbox', { name: '名称' })
  await screen.getByRole('button', { name: '设置提交' }).click()
  await target.click()
  await expect.element(screen.getByTestId('submits')).toHaveTextContent('1')
  await input.fill('已修改')
  await screen.getByRole('button', { name: '设置重置' }).click()
  await target.click()
  await expect.element(input).toHaveValue('Serenova')
  await expect.element(screen.getByTestId('resets')).toHaveTextContent('1')
  await screen.getByRole('button', { name: '移除类型' }).click()
  await expect.element(target).toHaveAttribute('type', 'button')
  await input.fill('保留内容')
  await target.click()
  await expect.element(input).toHaveValue('保留内容')
  await expect.element(screen.getByTestId('clicks')).toHaveTextContent('3')
  await expect.element(screen.getByTestId('submits')).toHaveTextContent('1')
  await expect.element(screen.getByTestId('resets')).toHaveTextContent('1')
})

test.each([
  { initialType: 'submit', disabled: true },
  { initialType: 'reset', disabled: true },
  { initialType: 'submit', loading: true },
  { initialType: 'reset', loading: true },
] as const)('$initialType 在 $disabled/$loading 状态阻止表单操作', async (props) => {
  const screen = await render(Fixture, {
    props: { initialType: props.initialType, disabled: props.disabled, loading: props.loading },
  })
  const target = screen.getByTestId('form-target')
  const input = screen.getByRole('textbox', { name: '名称' })
  await input.fill('保留内容')
  await expect.element(target).toBeDisabled()
  // 绕过测试驱动的可操作性等待，让浏览器实际收到禁用按钮上的指针输入。
  await target.click({ force: true })
  await input.click()
  await userEvent.tab()
  await expect.element(screen.getByRole('button', { name: '后续操作' })).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard(' ')
  await expect.element(screen.getByTestId('clicks')).toHaveTextContent('0')
  await expect.element(screen.getByTestId('submits')).toHaveTextContent('0')
  await expect.element(screen.getByTestId('resets')).toHaveTextContent('0')
  await expect.element(input).toHaveValue('保留内容')
})
