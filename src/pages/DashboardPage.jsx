import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Home, FileText, Landmark, Users, Plus, Send, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const quickActions = [
  {
    title: 'Browse Properties',
    description: 'Search available rentals.',
    icon: Home,
    href: '/properties',
    color: 'bg-purple-50 text-purple-500',
  },
  {
    title: 'My Applications',
    description: 'Track your applications.',
    icon: FileText,
    href: '/apply',
    color: 'bg-coral-50 text-coral-500',
  },
  {
    title: 'Deposit Aid',
    description: 'Get help with your deposit.',
    icon: Landmark,
    href: '/deposit-aid',
    color: 'bg-blue-50 text-blue-500',
  },
  {
    title: 'Round Up',
    description: 'Spare change to your deposit.',
    icon: TrendingUp,
    href: '/round-up',
    color: 'bg-amber-50 text-amber-500',
  },
  {
    title: 'Hub',
    description: 'Manage your household.',
    icon: Users,
    href: '/household',
    color: 'bg-emerald-50 text-emerald-500',
  },
]

function getActivityIcon(type) {
  switch (type) {
    case 'app_submitted':
      return { icon: FileText, bg: 'bg-blue-50', color: 'text-blue-500' }
    case 'app_approved':
      return { icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-500' }
    case 'deposit_approved':
      return { icon: Landmark, bg: 'bg-coral-50', color: 'text-coral-500' }
    case 'deposit_active':
      return { icon: DollarSign, bg: 'bg-amber-50', color: 'text-amber-500' }
    default:
      return { icon: FileText, bg: 'bg-gray-50', color: 'text-gray-500' }
  }
}

export default function DashboardPage() {
  const { profile, user } = useAuth()
  const [totalBalance, setTotalBalance] = useState(0)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const firstName = profile?.first_name || user?.user_metadata?.first_name || 'there'

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch total approved deposit amount
        const { data: deposits } = await supabase
          .from('deposit_applications')
          .select('deposit_amount, status')
          .eq('user_id', user.id)
          .in('status', ['approved', 'active'])

        const total = (deposits || []).reduce((sum, d) => sum + Number(d.deposit_amount || 0), 0)
        setTotalBalance(total)

        // Fetch recent applications
        const { data: apps } = await supabase
          .from('applications')
          .select('id, property_address_line_1, property_suburb, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        // Fetch recent deposit applications
        const { data: depApps } = await supabase
          .from('deposit_applications')
          .select('id, deposit_amount, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        // Combine and sort
        const items = []
        for (const app of (apps || [])) {
          items.push({
            id: `app-${app.id}`,
            type: app.status === 'approved' ? 'app_approved' : 'app_submitted',
            title: `${app.property_address_line_1}${app.property_suburb ? `, ${app.property_suburb}` : ''}`,
            subtitle: app.status === 'approved' ? 'Application approved' : 'Application submitted',
            date: app.created_at,
          })
        }
        for (const dep of (depApps || [])) {
          items.push({
            id: `dep-${dep.id}`,
            type: dep.status === 'active' ? 'deposit_active' : 'deposit_approved',
            title: `Deposit Aid`,
            subtitle: dep.status === 'active' ? 'Deposit active' : 'Deposit approved',
            amount: Number(dep.deposit_amount),
            date: dep.created_at,
          })
        }

        items.sort((a, b) => new Date(b.date) - new Date(a.date))
        setActivity(items.slice(0, 5))
      } catch {
        // Silently fail — dashboard still shows
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user.id])

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1">
        Welcome back, {firstName}
      </h1>
      <p className="text-gray-500 mb-6">Here&apos;s your overview.</p>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl p-6 text-white mb-6">
        <p className="text-white/80 text-sm font-medium mb-1">Total Balance</p>
        <p className="text-3xl font-bold mb-4">
          {loading ? '...' : `$${totalBalance.toLocaleString('en-AU')}`}
        </p>
        <div className="flex gap-3">
          <Link
            to="/deposit-aid/apply"
            className="flex items-center gap-1.5 h-10 px-4 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add money
          </Link>
          <Link
            to="/deposit-aid"
            className="flex items-center gap-1.5 h-10 px-4 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
          >
            <Send className="w-4 h-4" />
            Send
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-navy">Recent Activity</h2>
          <Link to="/apply" className="text-sm font-medium text-coral-500 hover:text-coral-600 transition-colors">
            See all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : activity.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm">No activity yet. Start by browsing properties!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {activity.map((item) => {
              const { icon: Icon, bg, color } = getActivityIcon(item.type)
              return (
                <div key={item.id} className="flex items-center gap-3 p-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy truncate">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {item.amount != null && (
                      <p className="text-sm font-semibold text-navy">${item.amount.toLocaleString('en-AU')}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(item.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-navy mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((card) => (
          <Link
            key={card.href}
            to={card.href}
            className="group block rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-medium hover:border-gray-300"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-navy group-hover:text-coral-500 transition-colors">
              {card.title}
            </h3>
            <p className="text-xs text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
