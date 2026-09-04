import { expect, test } from '@playwright/test'

test('从构建产物完成安装、样式加载和表单提交', async ({ page }) => {
  await page.goto('/')

  const submit = page.getByRole('button', { name: '提交' })
  await expect(submit).toBeVisible()
  await expect(submit).toHaveCSS('background-color', 'rgb(21, 94, 239)')
  await expect(submit).toHaveCSS('color', 'rgb(255, 255, 255)')

  await page.getByLabel('名称').fill('Serenova')
  await submit.click()

  await expect(page.getByTestId('confirmation')).toHaveText('已提交：Serenova')
})
