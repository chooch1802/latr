import { supabase } from './supabase'

export async function setupMandate() {
  const res = await supabase.functions.invoke('stripe-setup-mandate', {
    body: {},
  })
  if (res.error) throw new Error(res.error.message || 'Failed to setup payment mandate')
  return res.data
}
