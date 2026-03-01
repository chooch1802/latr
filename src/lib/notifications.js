import { supabase } from './supabase'

export async function createNotification(userId, type, title, message, data = {}) {
  try {
    await supabase.from('notifications').insert({
      user_id: userId,
      type,
      title,
      message,
      data,
    })
  } catch (err) {
    console.error('Failed to create notification:', err)
  }
}

export async function createBulkNotifications(userIds, type, title, message, data = {}) {
  try {
    if (!userIds.length) return
    const rows = userIds.map((userId) => ({
      user_id: userId,
      type,
      title,
      message,
      data,
    }))
    await supabase.from('notifications').insert(rows)
  } catch (err) {
    console.error('Failed to create bulk notifications:', err)
  }
}
