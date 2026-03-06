import { supabase } from './supabase'

// ── Balance & Tiers ──

export async function getRewardBalance() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('reward_balances')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getRewardTiers() {
  const { data, error } = await supabase
    .from('reward_tiers')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data || []
}

// ── Transactions ──

export async function getRewardTransactions({ limit = 50, offset = 0, type, category } = {}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let query = supabase
    .from('reward_transactions')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (type) query = query.eq('type', type)
  if (category) query = query.eq('category', category)

  const { data, error, count } = await query
  if (error) throw error
  return { transactions: data || [], total: count || 0 }
}

// ── Award Points (via edge function) ──

export async function awardPoints({ category, points, description, referenceType, referenceId, metadata }) {
  const res = await supabase.functions.invoke('rewards-award-points', {
    body: { category, points, description, referenceType, referenceId, metadata },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to award points')
  return res.data
}

// ── Referrals ──

export async function processReferral(referralCode) {
  const res = await supabase.functions.invoke('rewards-process-referral', {
    body: { referralCode },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to process referral')
  return res.data
}

export async function getReferrals() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('reward_referrals')
    .select('*, referred:referred_id(first_name, last_name)')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getReferralCode() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('users')
    .select('referral_code')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data?.referral_code
}

// ── Rent Day ──

export async function getCurrentRentDayEvent() {
  const now = new Date()
  const { data, error } = await supabase
    .from('rent_day_events')
    .select('*')
    .eq('month', now.getMonth() + 1)
    .eq('year', now.getFullYear())
    .maybeSingle()

  if (error) throw error
  return data
}

export async function enterRentDayRaffle(eventId) {
  const res = await supabase.functions.invoke('rewards-rent-day-enter', {
    body: { eventId },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to enter raffle')
  return res.data
}

// ── Redemptions ──

export async function getRedemptionCatalog({ category, minTier } = {}) {
  let query = supabase
    .from('redemption_catalog')
    .select('*')
    .eq('is_active', true)
    .order('points_cost')

  if (category) query = query.eq('category', category)
  if (minTier) query = query.eq('min_tier', minTier)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function redeemPoints(body) {
  const res = await supabase.functions.invoke('rewards-redeem', {
    body,
  })
  if (res.error) throw new Error(res.error.message || 'Failed to redeem points')
  return res.data
}

export async function getUserRedemptions() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('redemptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ── Tier Subscriptions ──

export async function createTierSubscription(tierSlug) {
  const res = await supabase.functions.invoke('stripe-create-tier-subscription', {
    body: { tierSlug },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to create subscription')
  return res.data
}

export async function getTierSubscription() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('tier_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', 'cancelled', 'past_due'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function cancelTierSubscription() {
  const res = await supabase.functions.invoke('stripe-cancel-tier-subscription', {
    body: {},
  })
  if (res.error) throw new Error(res.error.message || 'Failed to cancel subscription')
  return res.data
}

// ── Neighbourhood ──

export async function getNeighbourhoodPartners({ category, suburb, featured } = {}) {
  let query = supabase
    .from('neighbourhood_partners')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('rating', { ascending: false })

  if (category) query = query.eq('category', category)
  if (suburb) query = query.eq('suburb', suburb)
  if (featured) query = query.eq('is_featured', true)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getPartnerById(id) {
  const { data, error } = await supabase
    .from('neighbourhood_partners')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
