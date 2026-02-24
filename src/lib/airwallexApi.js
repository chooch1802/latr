import { supabase } from './supabase'

export async function createPayout(depositApplicationId) {
  const res = await supabase.functions.invoke('airwallex-create-payout', {
    body: { depositApplicationId },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to create payout')
  return res.data
}
