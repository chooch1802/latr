import { test, expect } from '@playwright/test'
import { loginAsOnboardedUser } from '../helpers/auth.js'
import { mockSupabaseAPIs } from '../helpers/mocks.js'
import { TEST_APPLICATIONS, TEST_ASSESSMENT } from '../helpers/fixtures.js'

test.describe('Personal deposit flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAPIs(page)
    await loginAsOnboardedUser(page)
  })

  test('full personal deposit application flow', async ({ page }) => {
    await page.goto('/deposit-aid/apply')

    // Step 1: Select Application
    await expect(page.getByText('Select Application')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Personal')).toBeVisible()

    // Should see the approved application
    const approvedApp = TEST_APPLICATIONS.find((a) => a.status === 'approved')
    await expect(page.getByText(approvedApp.property_address_line_1)).toBeVisible()

    // Click to select it
    await page.getByText(approvedApp.property_address_line_1).click()

    // Step 2: Deposit Details
    await expect(page.getByText('Deposit Details')).toBeVisible({ timeout: 10000 })

    // Amount should be pre-filled from the application
    const amountInput = page.locator('#amount')
    await expect(amountInput).toHaveValue(String(approvedApp.deposit_amount))

    // Select recipient type — it's a radio inside a label
    await page.getByLabel('landlord').check({ force: true })

    // Fill recipient details — Field component doesn't use htmlFor/id,
    // so we find inputs by their sibling label text
    await page.locator('div.mb-4').filter({ hasText: 'Recipient name' }).locator('input').fill('John Smith')
    await page.locator('div').filter({ hasText: /^BSB$/ }).locator('input').fill('062-000')
    await page.locator('div').filter({ hasText: /^Account number$/ }).locator('input').fill('12345678')

    // Continue
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 3: Choose Plan
    await expect(page.getByText('Choose Your Plan')).toBeVisible({ timeout: 10000 })

    // Select the first plan (click any plan card)
    await page.locator('[class*="rounded-xl"][class*="border"]').filter({ hasText: /weeks/i }).first().click()

    // Continue
    await page.getByRole('button', { name: 'Continue' }).click()

    // Step 4: Cash Flow Assessment
    await expect(page.getByText('Cash Flow Analysis')).toBeVisible({ timeout: 10000 })

    // Wait for assessment result
    await expect(page.getByText('LATR Score')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(String(TEST_ASSESSMENT.score))).toBeVisible()
    await expect(page.getByText(/Approved/i).first()).toBeVisible()

    // Confirm & Submit
    await page.getByRole('button', { name: /Confirm & Submit/i }).click()

    // Should navigate to confirmation page
    await expect(page).toHaveURL(/\/deposit-aid\/confirm\//, { timeout: 10000 })
  })

  test('shows no approved applications message', async ({ page }) => {
    // Override applications to return empty
    await page.route(
      (url) => url.toString().includes('/rest/v1/applications'),
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      }
    )

    await page.goto('/deposit-aid/apply')
    await expect(page.getByText('No approved applications yet')).toBeVisible({ timeout: 10000 })
  })
})
