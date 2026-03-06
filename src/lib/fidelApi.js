import { supabase } from './supabase'

export async function linkCard({ cardId, scheme, lastFour, expMonth, expYear }) {
  const res = await supabase.functions.invoke('fidel-link-card', {
    body: { cardId, scheme, lastFour, expMonth, expYear },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to link card')
  return res.data
}

export async function unlinkCard(cardId) {
  const res = await supabase.functions.invoke('fidel-unlink-card', {
    body: { cardId },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to unlink card')
  return res.data
}

export async function getLinkedCards() {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('linked_cards')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getCardTransactions({ limit = 20, offset = 0 } = {}) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('card_linked_transactions')
    .select('*, partner:partner_id(name, category)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return data || []
}
