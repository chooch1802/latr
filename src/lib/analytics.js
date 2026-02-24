import { supabase } from './supabase'

export async function trackEvent(eventName, properties = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('analytics_events').insert({
      user_id: user?.id || null,
      event_name: eventName,
      event_data: properties,
      page_url: typeof window !== 'undefined' ? window.location.pathname : null,
    })
  } catch {
    // Analytics should never break the app
  }
}
