import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Gift, Users, Award, ShoppingBag, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import StatsGrid from '../../components/admin/StatsGrid'

export default function AdminRewardsPage() {
  const [stats, setStats] = useState({ totalPointsIssued: 0, activeUsers: 0, totalRedemptions: 0, pendingRedemptions: 0 })
  const [tierDist, setTierDist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [lifetimeRes, activeRes, redemptionRes, pendingRes, tierRes] = await Promise.all([
        supabase.from('reward_balances').select('lifetime_points'),
        supabase.from('reward_balances').select('id', { count: 'exact', head: true }),
        supabase.from('redemptions').select('id', { count: 'exact', head: true }),
        supabase.from('redemptions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('reward_balances').select('current_tier'),
      ])

      const totalPts = (lifetimeRes.data || []).reduce((sum, r) => sum + (r.lifetime_points || 0), 0)

      // Tier distribution
      const dist = { bronze: 0, silver: 0, gold: 0, platinum: 0 }
      for (const row of tierRes.data || []) {
        dist[row.current_tier] = (dist[row.current_tier] || 0) + 1
      }

      setStats({
        totalPointsIssued: totalPts,
        activeUsers: activeRes.count || 0,
        totalRedemptions: redemptionRes.count || 0,
        pendingRedemptions: pendingRes.count || 0,
      })
      setTierDist(Object.entries(dist).map(([tier, count]) => ({ tier, count })))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Rewards Analytics</h1>

      <StatsGrid stats={[
        { label: 'Total Points Issued', value: stats.totalPointsIssued.toLocaleString('en-AU'), icon: Gift, color: 'bg-coral-500' },
        { label: 'Active Reward Users', value: stats.activeUsers, icon: Users, color: 'bg-blue-500' },
        { label: 'Total Redemptions', value: stats.totalRedemptions, icon: ShoppingBag, color: 'bg-purple-500' },
        { label: 'Pending Reviews', value: stats.pendingRedemptions, icon: Award, color: 'bg-amber-500' },
      ]} />

      {/* Tier distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-navy mb-4">Tier Distribution</h2>
        <div className="grid grid-cols-4 gap-3">
          {tierDist.map(({ tier, count }) => (
            <div key={tier} className="text-center p-3 rounded-lg bg-gray-50">
              <p className="text-2xl font-bold text-navy">{count}</p>
              <p className="text-xs text-gray-500 capitalize">{tier}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Manage Points', href: '/admin/rewards/points', icon: Gift },
          { label: 'Rent Day Events', href: '/admin/rewards/rent-day', icon: Award },
          { label: 'Partners', href: '/admin/rewards/partners', icon: Users },
          { label: 'Redemptions', href: '/admin/rewards/redemptions', icon: ShoppingBag },
        ].map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <link.icon className="w-5 h-5 text-coral-500" />
            <span className="text-sm font-medium text-navy flex-1">{link.label}</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  )
}
