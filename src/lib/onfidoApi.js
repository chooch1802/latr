import { supabase } from './supabase'

export async function createOnfidoCheck({ idDocumentPath, selfiePath }) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const res = await supabase.functions.invoke('onfido-create-check', {
    body: { idDocumentPath, selfiePath },
  })

  if (res.error) throw new Error(res.error.message || 'Failed to submit KYC verification')
  return res.data
}

export async function pollKYCStatus(userId, { maxAttempts = 30, intervalMs = 5000 } = {}) {
  for (let i = 0; i < maxAttempts; i++) {
    const { data } = await supabase
      .from('users')
      .select('kyc_status')
      .eq('id', userId)
      .single()

    if (data?.kyc_status === 'verified' || data?.kyc_status === 'rejected') {
      return data.kyc_status
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }
  return 'timeout'
}
