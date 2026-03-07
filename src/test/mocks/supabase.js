import { vi } from 'vitest'

/**
 * Creates a chainable mock Supabase client.
 * Configure responses with mockResolvedData / mockResolvedError on the chain.
 */
export function createMockSupabase() {
  let _resolvedData = null
  let _resolvedError = null
  let _resolvedCount = null

  const chain = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    neq: vi.fn(() => chain),
    in: vi.fn(() => chain),
    order: vi.fn(() => chain),
    range: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve({ data: _resolvedData, error: _resolvedError })),
    maybeSingle: vi.fn(() => Promise.resolve({ data: _resolvedData, error: _resolvedError })),
    insert: vi.fn(() => chain),
    update: vi.fn(() => chain),
    delete: vi.fn(() => chain),
    // Terminal — resolves the chain
    then: vi.fn((resolve) =>
      resolve({ data: _resolvedData, error: _resolvedError, count: _resolvedCount })
    ),
  }

  // Make chain itself thenable (for await on select().eq()... without .single())
  const thenableChain = new Proxy(chain, {
    get(target, prop) {
      if (prop === 'then') {
        return (resolve) =>
          resolve({ data: _resolvedData, error: _resolvedError, count: _resolvedCount })
      }
      return target[prop]
    },
  })

  // Replace chain methods to return the proxy
  for (const method of ['select', 'eq', 'neq', 'in', 'order', 'range', 'limit', 'insert', 'update', 'delete']) {
    chain[method] = vi.fn(() => thenableChain)
  }
  chain.single = vi.fn(() => Promise.resolve({ data: _resolvedData, error: _resolvedError }))
  chain.maybeSingle = vi.fn(() => Promise.resolve({ data: _resolvedData, error: _resolvedError }))

  const from = vi.fn(() => thenableChain)

  const functionsInvoke = vi.fn()

  const authGetUser = vi.fn(() =>
    Promise.resolve({ data: { user: { id: 'test-user-id' } } })
  )

  const mockClient = {
    from,
    functions: { invoke: functionsInvoke },
    auth: { getUser: authGetUser },
    // Helpers to configure responses
    _setResolvedData(data) {
      _resolvedData = data
    },
    _setResolvedError(error) {
      _resolvedError = error
    },
    _setResolvedCount(count) {
      _resolvedCount = count
    },
    // Access internals for assertions
    _chain: chain,
  }

  return mockClient
}
