import { supabase } from './supabase'

export async function createNotification(userId, type, title, message, data = {}) {
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    message,
    data,
  })
}

export async function createBulkNotifications(userIds, type, title, message, data = {}) {
  if (!userIds.length) return
  const rows = userIds.map((userId) => ({
    user_id: userId,
    type,
    title,
    message,
    data,
  }))
  await supabase.from('notifications').insert(rows)
}
