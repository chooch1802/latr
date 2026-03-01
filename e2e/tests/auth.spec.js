import { test, expect } from '@playwright/test'
import { mockAuth, loginAsOnboardedUser, loginAsNewUser, loginAsUser } from '../helpers/auth.js'
import { mockSupabaseAPIs } from '../helpers/mocks.js'
import { SUPABASE_URL, TEST_SESSION, TEST_PROFILE, TEST_ADMIN_PROFILE } from '../helpers/fixtures.js'

test.describe('Auth flows', () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseAPIs(page)
  })

  test('signup: phone entry → OTP → redirect to onboarding', async ({ page }) => {
    await mockAuth(page, { profile: { ...TEST_PROFILE, onboarding_step: 0 } })

    await page.goto('/signup')
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()

    // Fill signup form
    await page.getByLabel('First name').fill('Jane')
    await page.getByLabel('Last name').fill('Doe')
    await page.getByLabel('Mobile number').fill('0412345678')
    await page.getByLabel(/I agree to the/i).check()

    // Submit → should transition to OTP phase
    await page.getByRole('button', { name: 'Create account' }).click()
    await expect(page.getByRole('heading', { name: 'Enter verification code' })).toBeVisible()
    await expect(page.getByText('+61412345678')).toBeVisible()

    // Enter 6-digit OTP
    const otpInputs = page.getByRole('textbox', { name: /Digit/i })
    const digits = ['1', '2', '3', '4', '5', '6']
    for (let i = 0; i < 6; i++) {
      await otpInputs.nth(i).fill(digits[i])
    }

    // After OTP verify, should redirect to onboarding
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 10000 })
  })

  test('login: phone entry → OTP → redirect to dashboard', async ({ page }) => {
    await mockAuth(page, { profile: TEST_PROFILE })

    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()

    await page.getByLabel('Mobile number').fill('0412345678')
    await page.getByRole('button', { name: 'Send code' }).click()

    await expect(page.getByRole('heading', { name: 'Enter verification code' })).toBeVisible()

    // Enter OTP
    const otpInputs = page.getByRole('textbox', { name: /Digit/i })
    for (let i = 0; i < 6; i++) {
      await otpInputs.nth(i).fill(String(i + 1))
    }

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
  })

  test('unauthenticated user redirected to /login', async ({ page }) => {
    // No auth mocking — no session stored
    // Mock the auth endpoints to return 401 (no session)
    await page.route(`${SUPABASE_URL}/auth/v1/token*`, (route) => {
      route.fulfill({ status: 401, body: JSON.stringify({ error: 'invalid_grant' }) })
    })
    await page.route(`${SUPABASE_URL}/auth/v1/user`, (route) => {
      route.fulfill({ status: 401, body: JSON.stringify({ error: 'not_authenticated' }) })
    })

    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })

  test('incomplete onboarding redirected to /onboarding', async ({ page }) => {
    await loginAsNewUser(page)
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 10000 })
  })

  test('non-admin redirected from /admin to /dashboard', async ({ page }) => {
    await loginAsOnboardedUser(page)
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
  })

  test('admin can access /admin', async ({ page }) => {
    await loginAsUser(page, { profile: TEST_ADMIN_PROFILE })
    await page.goto('/admin')
    // Admin page should load (not redirect away)
    await expect(page).toHaveURL(/\/admin/)
  })

  test('already logged-in user on /login gets redirected to /dashboard', async ({ page }) => {
    await loginAsOnboardedUser(page)
    await page.goto('/login')
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
  })
})
