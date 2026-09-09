import { expect, test } from '@playwright/test'

test('从构建产物完成安装、样式加载和表单提交', async ({ page }) => {
  await page.goto('/')

  const submit = page.getByRole('button', { name: '提交' })
  await expect(submit).toBeVisible()
  await expect(submit).toHaveCSS('background-color', 'rgb(124, 58, 237)')
  await expect(submit).toHaveCSS('color', 'rgb(255, 255, 255)')

  await page.getByLabel('名称').fill('Serenova')
  await submit.click()
  await expect(submit).toBeDisabled()
  await expect(submit.locator('svg')).toHaveCount(1)
  await page.getByRole('button', { name: '完成请求' }).click()

  await expect(page.getByTestId('confirmation')).toHaveText('已提交：Serenova')
})

test('全量消费通过 Provider 切换主题并保留表单数据', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('名称').fill('主题数据')
  await page.getByRole('button', { name: '切换主题' }).click()
  const submit = page.getByRole('button', { name: '提交', exact: true })
  await expect(submit).toHaveCSS('background-color', 'rgb(132, 173, 255)')
  await submit.click()
  await expect(submit).toBeDisabled()
  await expect(submit.locator('svg')).toHaveCount(1)
  await page.getByRole('button', { name: '完成请求' }).click()
  await expect(page.getByTestId('confirmation')).toHaveText('已提交：主题数据')
})

test('按需消费独立默认样式、主题切换与运行时状态', async ({ page }) => {
  await page.goto('/ondemand.html')
  const button = page.getByRole('button', { name: '计数', exact: true })
  await expect(page.getByTestId('standalone')).toHaveCSS('background-color', 'rgb(124, 58, 237)')
  await expect(button.locator('svg')).toHaveCount(2)
  await button.click()
  await button.press('Enter')
  await expect(page.locator('output')).toHaveText('2')
  await page.getByRole('button', { name: '切换主题' }).click()
  await expect(button).toHaveCSS('background-color', 'rgb(132, 173, 255)')
  await expect(page.getByTestId('standalone')).toHaveCSS('background-color', 'rgb(124, 58, 237)')
  await page.getByRole('button', { name: '切换加载' }).click()
  await expect(button).toBeDisabled()
  await expect(button.locator('.s-button__spinner')).toBeVisible()
})

test('发布包支持错误色文字操作及加载阻断', async ({ page }) => {
  await page.goto('/ondemand.html')
  const target = page.getByTestId('error-text')
  await expect(target).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await expect(target).toHaveCSS('color', 'rgb(240, 100, 104)')
  await expect(target).toHaveCSS('padding-left', '0px')
  await expect(target).toHaveCSS('min-width', '0px')
  await target.click()
  await target.press('Enter')
  await expect(page.locator('output')).toHaveText('2')
  await page.getByRole('button', { name: '切换加载' }).click()
  await expect(target).toBeDisabled()
  await expect(target).toHaveCSS('color', 'rgb(230, 171, 174)')
  await expect(target.locator('svg')).toHaveCount(1)
})

for (const entry of ['named']) {
  test(`${entry} 接入保持默认主题、style 覆盖和样式去重`, async ({ page }) => {
    await page.goto(`/${entry}.html`)
    await expect(page.getByRole('button', { name: '根入口按钮' })).toHaveCSS(
      'background-color',
      'rgb(124, 58, 237)',
    )
    await expect(page.getByRole('button', { name: '覆盖按钮' })).toHaveCSS(
      'background-color',
      'rgb(18, 52, 86)',
    )
    await expect(page.locator('head style[data-serenova-style]')).toHaveCount(1)
    if (entry === 'named') {
      const css = await page.locator('head').evaluate((head) =>
        Array.from(
          head.querySelectorAll('link[rel="stylesheet"], style:not([data-serenova-style])'),
        )
          .map((node) => node.textContent || node.getAttribute('href'))
          .join(''),
      )
      expect(css).not.toContain('s-button')
    }
  })
}
