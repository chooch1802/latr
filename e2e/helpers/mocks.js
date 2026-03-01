import {
  SUPABASE_URL,
  TEST_APPLICATIONS,
  TEST_DEPOSIT_APPLICATIONS,
  TEST_BANK_ACCOUNTS,
  TEST_TRANSACTIONS,
  TEST_ASSESSMENT,
  TEST_BUSINESS_VERIFICATION,
} from './fixtures.js'

/**
 * Mock all Supabase Edge Function calls and REST API queries.
 * This lets tests run without any live vendor sandboxes.
 */
export async function mockSupabaseAPIs(page) {
  await mockEdgeFunctions(page)
  await mockRestAPI(page)
  await mockExternalScripts(page)
}

// ── Edge Functions ────────────────────────────────────────────

async function mockEdgeFunctions(page) {
  const fnUrl = `${SUPABASE_URL}/functions/v1`

  await page.route(`${fnUrl}/onfido-create-check`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ checkId: 'test_check_123', status: 'in_progress' }),
    })
  })

  await page.route(`${fnUrl}/basiq-create-connection`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        basiqUserId: 'test_basiq_user',
        consentUrl: 'https://consent.basiq.io/test',
      }),
    })
  })

  await page.route(`${fnUrl}/basiq-fetch-data`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accounts: TEST_BANK_ACCOUNTS,
        transactions: TEST_TRANSACTIONS,
      }),
    })
  })

  await page.route(`${fnUrl}/basiq-run-assessment`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(TEST_ASSESSMENT),
    })
  })

  await page.route(`${fnUrl}/stripe-setup-mandate`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        clientSecret: 'seti_test_secret_123',
        customerId: 'cus_test_123',
      }),
    })
  })

  await page.route(`${fnUrl}/stripe-collect-payments`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ collected: true, count: 1 }),
    })
  })

  await page.route(`${fnUrl}/airwallex-create-payout`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        payoutId: 'payout_test_123',
        status: 'processing',
      }),
    })
  })

  await page.route(`${fnUrl}/verify-business`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(TEST_BUSINESS_VERIFICATION),
    })
  })

  await page.route(`${fnUrl}/send-email`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, id: 'email_test_123' }),
    })
  })

  await page.route(`${fnUrl}/admin-review-application`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  })

  await page.route(`${fnUrl}/domain-search*`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: [
          {
            id: 'prop-001',
            address: '42 Harbour Street, Sydney NSW 2000',
            price: 600,
            bedrooms: 2,
            bathrooms: 1,
            type: 'Apartment',
          },
        ],
      }),
    })
  })

  await page.route(`${fnUrl}/roundup-sync-transactions`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ synced: 3, totalRoundUp: 2.57 }),
    })
  })
}

// ── Supabase REST API (PostgREST) ────────────────────────────

async function mockRestAPI(page) {
  const restUrl = `${SUPABASE_URL}/rest/v1`

  // Applications table
  await page.route(
    (url) => {
      const u = url.toString()
      return u.includes(`${restUrl}/applications`) && !u.includes('/rest/v1/users')
    },
    (route) => {
      const method = route.request().method()
      const url = route.request().url()

      if (method === 'GET') {
        // Filter approved apps if the query has status=eq.approved
        if (url.includes('status=eq.approved')) {
          const approved = TEST_APPLICATIONS.filter((a) => a.status === 'approved')
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(approved),
          })
        }
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(TEST_APPLICATIONS),
        })
      }

      if (method === 'POST') {
        const newApp = { id: 'app-new-001', ...TEST_APPLICATIONS[0] }
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newApp),
        })
      }

      route.continue()
    }
  )

  // Deposit applications table
  await page.route(
    (url) => {
      const u = url.toString()
      return u.includes(`${restUrl}/deposit_applications`)
    },
    (route) => {
      const method = route.request().method()

      if (method === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(TEST_DEPOSIT_APPLICATIONS),
        })
      }

      if (method === 'POST') {
        const newDep = { id: 'dep-new-001', ...TEST_DEPOSIT_APPLICATIONS[0] }
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newDep),
          headers: { 'content-range': '0-0/1' },
        })
      }

      if (method === 'PATCH') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(TEST_DEPOSIT_APPLICATIONS[0]),
        })
      }

      route.continue()
    }
  )

  // Notifications table
  await page.route(
    (url) => url.toString().includes(`${restUrl}/notifications`),
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    }
  )

  // Households table
  await page.route(
    (url) => url.toString().includes(`${restUrl}/households`),
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    }
  )

  // Household members
  await page.route(
    (url) => url.toString().includes(`${restUrl}/household_members`),
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    }
  )

  // Bills table
  await page.route(
    (url) => url.toString().includes(`${restUrl}/bills`),
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    }
  )

  // Round-ups table
  await page.route(
    (url) => url.toString().includes(`${restUrl}/round_ups`),
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    }
  )

  // Round-up settings
  await page.route(
    (url) => url.toString().includes(`${restUrl}/round_up_settings`),
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(null),
        headers: { 'content-range': '0-0/0' },
      })
    }
  )

  // User profiles table (address data from onboarding)
  await page.route(
    (url) => url.toString().includes(`${restUrl}/user_profiles`),
    (route) => {
      const method = route.request().method()
      if (method === 'POST' || method === 'PATCH') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'profile-001' }),
        })
      }
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    }
  )

  // Business verifications table
  await page.route(
    (url) => url.toString().includes(`${restUrl}/business_verifications`),
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    }
  )

  // Webhook events (admin)
  await page.route(
    (url) => url.toString().includes(`${restUrl}/webhook_events`),
    (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    }
  )
}

// ── External Scripts (Stripe.js, Google Maps) ────────────────

async function mockExternalScripts(page) {
  // Block Stripe.js from loading — we don't need the real SDK in tests
  await page.route('https://js.stripe.com/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '// Stripe.js mocked for testing',
    })
  })

  // Block Google Maps API
  await page.route('https://maps.googleapis.com/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '// Google Maps mocked for testing',
    })
  })

  // Block Sentry
  await page.route('https://*.ingest.sentry.io/**', (route) => {
    route.fulfill({ status: 200, body: '{}' })
  })

  // Block Supabase realtime websocket
  await page.route(`${SUPABASE_URL}/realtime/**`, (route) => {
    route.abort()
  })
}
