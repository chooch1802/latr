import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockSupabase } from '../test/mocks/supabase'

vi.mock('./supabase', () => {
  const mock = createMockSupabase()
  return { supabase: mock }
})

import { supabase } from './supabase'
import {
  getRewardBalance,
  getRewardTiers,
  getRewardTransactions,
  awardPoints,
  processReferral,
  getReferralCode,
  getReferrals,
  getRedemptionCatalog,
  redeemPoints,
  getUserRedemptions,
} from './rewardsApi'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getRewardBalance', () => {
  it('queries reward_balances for current user', async () => {
    const mockBalance = { user_id: 'test-user-id', points: 1200, tier: 'gold' }
    supabase._setResolvedData(mockBalance)

    const result = await getRewardBalance()

    expect(supabase.from).toHaveBeenCalledWith('reward_balances')
    expect(supabase._chain.eq).toHaveBeenCalledWith('user_id', 'test-user-id')
    expect(result).toEqual(mockBalance)
  })
})

describe('getRewardTiers', () => {
  it('queries reward_tiers ordered by sort_order', async () => {
    supabase._setResolvedData([
      { slug: 'silver', sort_order: 1 },
      { slug: 'gold', sort_order: 2 },
    ])

    const result = await getRewardTiers()

    expect(supabase.from).toHaveBeenCalledWith('reward_tiers')
    expect(supabase._chain.order).toHaveBeenCalledWith('sort_order')
    expect(result).toHaveLength(2)
  })

  it('returns empty array when no tiers', async () => {
    supabase._setResolvedData(null)
    const result = await getRewardTiers()
    expect(result).toEqual([])
  })
})

describe('getRewardTransactions', () => {
  it('queries with pagination and ordering', async () => {
    supabase._setResolvedData([{ id: 't1', points: 100 }])
    supabase._setResolvedCount(1)

    const result = await getRewardTransactions({ limit: 10, offset: 0 })

    expect(supabase.from).toHaveBeenCalledWith('reward_transactions')
    expect(supabase._chain.select).toHaveBeenCalledWith('*', { count: 'exact' })
    expect(supabase._chain.eq).toHaveBeenCalledWith('user_id', 'test-user-id')
    expect(supabase._chain.order).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(supabase._chain.range).toHaveBeenCalledWith(0, 9)
    expect(result.transactions).toHaveLength(1)
    expect(result.total).toBe(1)
  })

  it('returns empty transactions when no data', async () => {
    supabase._setResolvedData(null)
    supabase._setResolvedCount(0)

    const result = await getRewardTransactions()
    expect(result.transactions).toEqual([])
    expect(result.total).toBe(0)
  })
})

describe('awardPoints', () => {
  it('invokes rewards-award-points edge function', async () => {
    supabase.functions.invoke.mockResolvedValue({ data: { points: 100 }, error: null })

    const body = { category: 'repayment_ontime', points: 100, description: 'On-time repayment' }
    const result = await awardPoints(body)

    expect(supabase.functions.invoke).toHaveBeenCalledWith('rewards-award-points', { body })
    expect(result).toEqual({ points: 100 })
  })

  it('throws on error', async () => {
    supabase.functions.invoke.mockResolvedValue({ data: null, error: { message: 'Duplicate' } })
    await expect(awardPoints({ category: 'test', points: 1 })).rejects.toThrow('Duplicate')
  })
})

describe('processReferral', () => {
  it('invokes rewards-process-referral edge function', async () => {
    supabase.functions.invoke.mockResolvedValue({ data: { ok: true }, error: null })

    await processReferral('ABC123')

    expect(supabase.functions.invoke).toHaveBeenCalledWith('rewards-process-referral', {
      body: { referralCode: 'ABC123' },
    })
  })

  it('throws on invalid code', async () => {
    supabase.functions.invoke.mockResolvedValue({ data: null, error: { message: 'Invalid referral code' } })
    await expect(processReferral('BADCODE')).rejects.toThrow('Invalid referral code')
  })
})

describe('getReferralCode', () => {
  it('queries users table for referral_code', async () => {
    supabase._setResolvedData({ referral_code: 'REF-ABC123' })

    const result = await getReferralCode()

    expect(supabase.from).toHaveBeenCalledWith('users')
    expect(supabase._chain.select).toHaveBeenCalledWith('referral_code')
    expect(supabase._chain.eq).toHaveBeenCalledWith('id', 'test-user-id')
    expect(result).toBe('REF-ABC123')
  })
})

describe('redeemPoints', () => {
  it('invokes rewards-redeem edge function', async () => {
    supabase.functions.invoke.mockResolvedValue({ data: { redemption_id: 'r1' }, error: null })

    const body = { catalogItemId: 'item1', quantity: 1 }
    const result = await redeemPoints(body)

    expect(supabase.functions.invoke).toHaveBeenCalledWith('rewards-redeem', { body })
    expect(result).toEqual({ redemption_id: 'r1' })
  })

  it('throws on insufficient balance', async () => {
    supabase.functions.invoke.mockResolvedValue({ data: null, error: { message: 'Insufficient points' } })
    await expect(redeemPoints({ catalogItemId: 'x' })).rejects.toThrow('Insufficient points')
  })
})

describe('getUserRedemptions', () => {
  it('queries redemptions for current user', async () => {
    supabase._setResolvedData([{ id: 'r1', status: 'approved' }])

    const result = await getUserRedemptions()

    expect(supabase.from).toHaveBeenCalledWith('redemptions')
    expect(supabase._chain.eq).toHaveBeenCalledWith('user_id', 'test-user-id')
    expect(supabase._chain.order).toHaveBeenCalledWith('created_at', { ascending: false })
    expect(result).toHaveLength(1)
  })
})

describe('getRedemptionCatalog', () => {
  it('queries active catalog items ordered by points_cost', async () => {
    supabase._setResolvedData([{ id: 'c1', name: 'Gift Card', points_cost: 500 }])

    const result = await getRedemptionCatalog()

    expect(supabase.from).toHaveBeenCalledWith('redemption_catalog')
    expect(supabase._chain.eq).toHaveBeenCalledWith('is_active', true)
    expect(supabase._chain.order).toHaveBeenCalledWith('points_cost')
    expect(result).toHaveLength(1)
  })

  it('returns empty array when no items', async () => {
    supabase._setResolvedData(null)
    const result = await getRedemptionCatalog()
    expect(result).toEqual([])
  })
})
