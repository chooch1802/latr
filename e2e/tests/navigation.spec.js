import { test, expect } from '@playwright/test'
import { loginAsOnboardedUser } from '../helpers/auth.js'
import { mockSupabaseAPIs } from '../helpers/mocks.js'

test.describe('Core navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAPIs(page)
    await loginAsOnboardedUser(page)
  })

  test('dashboard loads with welcome message and user data', async ({ page }) => {
    await page.goto('/dashboard')

    // Welcome message with first name
    await expect(page.getByRole('heading', { name: /Welcome back, Jane/i })).toBeVisible({
      timeout: 10000,
    })

    // Balance card should be visible
    await expect(page.getByText('Total Balance')).toBeVisible()

    // Quick actions should be visible
    await expect(page.getByText('Quick Actions')).toBeVisible()
    await expect(page.getByRole('link', { name: /Browse Properties/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /My Applications/i })).toBeVisible()
  })

  test('navigate to Properties page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Properties/i }).first().click()
    await expect(page).toHaveURL(/\/properties/)
  })

  test('navigate to Applications page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Applications/i }).first().click()
    await expect(page).toHaveURL(/\/apply/)
  })

  test('navigate to Deposit Aid page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Deposit Aid/i }).first().click()
    await expect(page).toHaveURL(/\/deposit-aid/)
  })

  test('navigate to Round Up page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Round Up/i }).first().click()
    await expect(page).toHaveURL(/\/round-up/)
  })

  test('navigate to Hub page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Hub/i }).first().click()
    await expect(page).toHaveURL(/\/household/)
  })

  test('navigate to Settings page', async ({ page }) => {
    await page.goto('/dashboard')
    await page.getByRole('link', { name: /Settings/i }).first().click()
    await expect(page).toHaveURL(/\/settings/)
  })

  test('recent activity section renders', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByText('Recent Activity')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('link', { name: 'See all' })).toBeVisible()
  })

  test('404 page for unknown routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByText('Page not found')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('404')).toBeVisible()
  })
})

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test.beforeEach(async ({ page }) => {
    await mockSupabaseAPIs(page)
    await loginAsOnboardedUser(page)
  })

  test('mobile bottom tab bar is visible', async ({ page }) => {
    await page.goto('/dashboard')

    // Bottom tab bar should be visible on mobile
    const tabBar = page.locator('nav.fixed.bottom-0')
    await expect(tabBar).toBeVisible({ timeout: 10000 })

    // Should show first 5 nav items
    await expect(tabBar.getByText('Dashboard')).toBeVisible()
    await expect(tabBar.getByText('Properties')).toBeVisible()
    await expect(tabBar.getByText('Applications')).toBeVisible()
    await expect(tabBar.getByText('Deposit Aid')).toBeVisible()
    await expect(tabBar.getByText('Round Up')).toBeVisible()
  })

  test('mobile tab navigation works', async ({ page }) => {
    await page.goto('/dashboard')

    const tabBar = page.locator('nav.fixed.bottom-0')

    // Navigate to Properties via tab bar
    await tabBar.getByText('Properties').click()
    await expect(page).toHaveURL(/\/properties/)

    // Navigate back to Dashboard
    await tabBar.getByText('Dashboard').click()
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('sidebar is hidden on mobile', async ({ page }) => {
    await page.goto('/dashboard')
    const sidebar = page.locator('aside')
    await expect(sidebar).toBeHidden()
  })

  test('mobile header shows LATR logo', async ({ page }) => {
    await page.goto('/dashboard')
    // The mobile LATR logo is the one inside the header (md:hidden)
    const header = page.locator('header')
    await expect(header.getByText('LATR')).toBeVisible({ timeout: 10000 })
  })
})
