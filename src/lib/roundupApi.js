import { supabase } from './supabase'

export async function syncRoundupTransactions() {
  const res = await supabase.functions.invoke('roundup-sync-transactions', {
    body: {},
  })
  if (res.error) throw new Error(res.error.message || 'Failed to sync transactions')
  return res.data
}
