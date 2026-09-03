import { expect, test } from '@playwright/test'

import { buttonStoryIds, storyUrl } from '../../support/playwright/storybook'

test('自动发现 Button Stories，并通过参数链接复现主题、RTL 与移动端环境', async ({
  page,
  request,
}) => {
  const indexResponse = await request.get('/index.json')
  expect(indexResponse.ok()).toBe(true)

  const index = (await indexResponse.json()) as {
    entries: Record<string, { id: string; type: string }>
  }
  expect(Object.keys(index.entries)).toEqual(expect.arrayContaining(Object.values(buttonStoryIds)))

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(
    storyUrl(buttonStoryIds.playground, {
      args: 'variant:danger;size:large;block:true',
      globals: 'theme:dark;direction:rtl',
    }),
  )

  const button = page.getByTestId('playground-button')
  await expect(button).toHaveClass(/s-button--danger/)
  await expect(button).toHaveClass(/s-button--large/)
  await expect(button).toHaveClass(/s-button--block/)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(16, 24, 40)')
  expect(page.viewportSize()).toEqual({ width: 390, height: 844 })
})

test('执行 Storybook play 交互并呈现可调试结果', async ({ page }) => {
  await page.goto(storyUrl(buttonStoryIds.interaction))

  await expect(page.getByText('点击次数：1')).toBeVisible()
  await expect(page.getByTestId('interaction-button')).toBeEnabled()
})
