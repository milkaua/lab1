// tests/app.spec.js — E2E тести (Playwright)
import { test, expect } from '@playwright/test'

test.describe('Task Manager — критичний шлях', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('сторінка завантажується і показує задачі', async ({ page }) => {
    await expect(page.locator('.task-card')).not.toHaveCount(0)
    await expect(page.locator('#stats-total')).not.toHaveText('0')
  })

  test('додає нове завдання через форму', async ({ page }) => {
    const before = await page.locator('.task-card').count()

    await page.fill('#new-title', 'E2E тест завдання')
    await page.selectOption('#new-priority', 'high')
    await page.click('.btn-add')

    await expect(page.locator('.task-card')).toHaveCount(before + 1)
    await expect(page.locator('.task-title').last()).toContainText('E2E тест завдання')
  })

  test('не додає завдання з порожньою назвою', async ({ page }) => {
    const before = await page.locator('.task-card').count()
    await page.click('.btn-add')
    await expect(page.locator('.task-card')).toHaveCount(before)
  })

  test('фільтр за статусом "Done" показує лише виконані', async ({ page }) => {
    await page.click('[data-status-filter="done"]')
    const cards = page.locator('.task-card')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveClass(/done/)
    }
  })

  test('пошук фільтрує завдання', async ({ page }) => {
    await page.fill('#search', 'Vitest')
    await expect(page.locator('.task-card')).toHaveCount(1)
    await expect(page.locator('.task-title').first()).toContainText('Vitest')
  })

})
