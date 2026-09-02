import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { buttonStoryIds, storyUrl } from '../helpers/storybook'

async function prepareStory(page: Page, storyId: string) {
  await page.goto(storyUrl(storyId))
  await page.addStyleTag({
    content:
      '*, *::before, *::after { caret-color: transparent !important; font-family: Arial, sans-serif !important; }',
  })
}

test('Button 视觉变体矩阵', async ({ page }) => {
  await prepareStory(page, buttonStoryIds.variants)

  await expect(page.getByTestId('button-variant-matrix')).toHaveScreenshot('button-variants.png')
})

test('Button 尺寸与状态矩阵', async ({ page }) => {
  await prepareStory(page, buttonStoryIds.sizesAndStates)

  await expect(page.getByTestId('button-state-matrix')).toHaveScreenshot('button-states.png')
})
