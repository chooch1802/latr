import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockSupabase } from '../test/mocks/supabase'

// We need to mock the supabase module before importing fidelApi
vi.mock('./supabase', () => {
  const mock = createMockSupabase()
  return { supabase: mock }
})

// Now import both
import { supabase } from './supabase'
import { linkCard, unlinkCard, getLinkedCards, getCardTransactions } from './fidelApi'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('linkCard', () => {
  it('invokes fidel-link-card edge function with card data', async () => {
    supabase.functions.invoke.mockResolvedValue({ data: { ok: true }, error: null })

    const cardData = {
      cardId: 'card_123',
      scheme: 'visa',
      lastFour: '4242',
      expMonth: 12,
      expYear: 2027,
    }
    const result = await linkCard(cardData)

    expect(supabase.functions.invoke).toHaveBeenCalledWith('fidel-link-card', {
      body: cardData,
    })
    expect(result).toEqual({ ok: true })
  })

  it('throws on error response', async () => {
    supabase.functions.invoke.mockResolvedValue({
      data: null,
      error: { message: 'Card already linked' },
    })

    await expect(linkCard({ cardId: 'x' })).rejects.toThrow('Card already linked')
  })
})

describe('unlinkCard', () => {
  it('invokes fidel-unlink-card edge function', async () => {
    supabase.functions.invoke.mockResolvedValue({ data: { ok: true }, error: null })

    await unlinkCard('card_456')

    expect(supabase.functions.invoke).toHaveBeenCalledWith('fidel-unlink-card', {
      body: { cardId: 'card_456' },
    })
  })

  it('throws on error response', async () => {
    supabase.functions.invoke.mockResolvedValue({
      data: null,
      error: { message: 'Card not found' },
    })

    await expect(unlinkCard('bad_id')).rejects.toThrow('Card not found')
  })
})

describe('getLinkedCards', () => {
  it('queries linked_cards for active cards', async () => {
    supabase._setResolvedData([
      { id: '1', scheme: 'visa', last_four: '4242', status: 'active' },
    ])

    const result = await getLinkedCards()

    expect(supabase.from).toHaveBeenCalledWith('linked_cards')
    expect(supabase._chain.select).toHaveBeenCalledWith('*')
    expect(supabase._chain.eq).toHaveBeenCalledWith('user_id', 'test-user-id')
    expect(supabase._chain.eq).toHaveBeenCalledWith('status', 'active')
    expect(result).toHaveLength(1)
  })

  it('returns empty array when no cards', async () => {
    supabase._setResolvedData(null)
    const result = await getLinkedCards()
    expect(result).toEqual([])
  })
})

describe('getCardTransactions', () => {
  it('queries card_linked_transactions with join and pagination', async () => {
    supabase._setResolvedData([
      { id: 't1', amount: 500, partner: { name: 'Test', category: 'food' } },
    ])

    const result = await getCardTransactions({ limit: 10, offset: 0 })

    expect(supabase.from).toHaveBeenCalledWith('card_linked_transactions')
    expect(supabase._chain.select).toHaveBeenCalledWith('*, partner:partner_id(name, category)')
    expect(supabase._chain.eq).toHaveBeenCalledWith('user_id', 'test-user-id')
    expect(supabase._chain.order).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(supabase._chain.range).toHaveBeenCalledWith(0, 9)
    expect(result).toHaveLength(1)
  })

  it('uses default limit=20 offset=0', async () => {
    supabase._setResolvedData([])
    await getCardTransactions()
    expect(supabase._chain.range).toHaveBeenCalledWith(0, 19)
  })
})
