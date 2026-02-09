import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Receipt, CreditCard, FileText, Users, Landmark, UserPlus, CheckCheck, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const typeIcons = {
  bill_created: Receipt,
  payment_marked: CreditCard,
  application_update: FileText,
  household_invite: UserPlus,
  deposit_update: Landmark,
  member_joined: Users,
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setNotifications(data || [])
      setLoading(false)
    }
    fetch()
  }, [user.id])

  async function handleClick(notif) {
    if (!notif.read) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notif.id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      )
    }
    if (notif.data?.link) {
      navigate(notif.data.link)
    }
  }

  async function handleMarkAllRead() {
    setMarkingAll(true)
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setMarkingAll(false)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-3">
        <div className="h-6 bg-gray-200 rounded w-48" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-navy">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="h-9 px-3 text-sm font-medium text-coral-500 hover:bg-coral-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-navy mb-1">No notifications yet</h2>
          <p className="text-sm text-gray-400">We'll let you know when something important happens.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell
            return (
              <button
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`w-full bg-white rounded-xl border p-4 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notif.read
                    ? 'border-l-4 border-l-coral-500 border-t-gray-200 border-r-gray-200 border-b-gray-200'
                    : 'border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  !notif.read ? 'bg-coral-50 text-coral-500' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notif.read ? 'font-semibold text-navy' : 'text-gray-600'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-gray-300 mt-1">{timeAgo(notif.created_at)}</p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-coral-500 shrink-0 mt-1.5" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
