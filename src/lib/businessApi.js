import { supabase } from './supabase'

export async function verifyBusiness({ depositApplicationId, abn, acn, businessName, applicantRole }) {
  const res = await supabase.functions.invoke('verify-business', {
    body: { depositApplicationId, abn, acn, businessName, applicantRole },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to verify business')
  return res.data
}
