import { supabase } from './supabase'

export async function createBankConnection() {
  const res = await supabase.functions.invoke('basiq-create-connection', {
    body: {},
  })
  if (res.error) throw new Error(res.error.message || 'Failed to create bank connection')
  return res.data
}

export async function fetchBankData(basiqUserId) {
  const res = await supabase.functions.invoke('basiq-fetch-data', {
    body: { basiqUserId },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to fetch bank data')
  return res.data
}

export async function runAssessment() {
  const res = await supabase.functions.invoke('basiq-run-assessment', {
    body: {},
  })
  if (res.error) throw new Error(res.error.message || 'Failed to run assessment')
  return res.data
}
