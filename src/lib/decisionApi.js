import { supabase } from './supabase'

export async function runAutoDecision(applicationId) {
  const res = await supabase.functions.invoke('auto-decision', {
    body: { application_id: applicationId },
  })
  if (res.error) throw new Error(res.error.message || 'Failed to run auto-decision')
  return res.data
}

export async function getDecisionLog(applicationId) {
  const { data, error } = await supabase
    .from('decision_log')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message || 'Failed to fetch decision log')
  return data || []
}
