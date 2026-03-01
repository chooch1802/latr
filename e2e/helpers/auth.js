import {
  SUPABASE_URL,
  TEST_USER,
  TEST_SESSION,
  TEST_PROFILE,
  TEST_ADMIN_PROFILE,
  TEST_PROFILE_NEW,
  TEST_PROFILE_PARTIAL_ONBOARDING,
  TEST_ADMIN_ID,
} from './fixtures.js'

/**
 * Intercept all Supabase auth API calls so we can test flows
 * without hitting real Twilio/SMS or needing a live Supabase instance.
 */
export async function mockAuth(page, { profile = TEST_PROFILE } = {}) {
  const authUrl = `${SUPABASE_URL}/auth/v1`

  // Mock getSession — returns a valid session immediately
  await page.route(`${authUrl}/token?grant_type=refresh_token`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(TEST_SESSION),
    })
  })

  // Mock signInWithOtp (send SMS)
  await page.route(`${authUrl}/otp`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message_id: 'test_msg_id' }),
    })
  })

  // Mock verifyOtp
  await page.route(`${authUrl}/token?grant_type=id_token`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(TEST_SESSION),
    })
  })

  // Mock verify OTP (phone verification)
  await page.route(`${authUrl}/verify`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(TEST_SESSION),
    })
  })

  // Mock getUser
  await page.route(`${authUrl}/user`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(TEST_SESSION.user),
    })
  })

  // Mock the users table profile fetch
  await page.route(
    (url) => {
      const u = url.toString()
      return u.includes('/rest/v1/users') && u.includes('select=')
    },
    (route) => {
      const method = route.request().method()
      if (method === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(profile),
          headers: {
            'content-range': '0-0/1',
          },
        })
      } else if (method === 'PATCH') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(profile),
        })
      } else {
        route.continue()
      }
    }
  )
}

/**
 * Set up auth state via localStorage so the app boots as already logged in.
 * Call this before page.goto() to skip the login flow entirely.
 */
export async function loginAsUser(page, { profile = TEST_PROFILE } = {}) {
  const storageKey = `sb-pblmlpjzowlicjevqgir-auth-token`
  const sessionData = {
    ...TEST_SESSION,
    user: { ...TEST_USER, id: profile.id },
  }

  await page.addInitScript(
    ({ key, session }) => {
      window.localStorage.setItem(key, JSON.stringify(session))
    },
    { key: storageKey, session: sessionData }
  )

  await mockAuth(page, { profile })
}

/** Log in as a user with completed onboarding */
export async function loginAsOnboardedUser(page) {
  await loginAsUser(page, { profile: TEST_PROFILE })
}

/** Log in as a new user who hasn't started onboarding */
export async function loginAsNewUser(page) {
  await loginAsUser(page, { profile: TEST_PROFILE_NEW })
}

/** Log in as a user partway through onboarding */
export async function loginAsPartialUser(page) {
  await loginAsUser(page, { profile: TEST_PROFILE_PARTIAL_ONBOARDING })
}

/** Log in as an admin */
export async function loginAsAdmin(page) {
  await loginAsUser(page, { profile: TEST_ADMIN_PROFILE })
}
