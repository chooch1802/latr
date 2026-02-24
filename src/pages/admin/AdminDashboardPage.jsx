import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Landmark, Users, DollarSign, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import StatsGrid from '../../components/admin/StatsGrid'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, applications: 0, deposits: 0, activeDeposits: 0 })
  const [recentApps, setRecentApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [usersRes, appsRes, depositsRes, activeRes, recentRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('applications').select('id', { count: 'exact', head: true }),
        supabase.from('deposit_applications').select('id', { count: 'exact', head: true }),
        supabase.from('deposit_applications').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('applications').select('id, property_address_line_1, property_suburb, status, created_at').order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        users: usersRes.count || 0,
        applications: appsRes.count || 0,
        deposits: depositsRes.count || 0,
        activeDeposits: activeRes.count || 0,
      })
      setRecentApps(recentRes.data || [])
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
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>

      <StatsGrid stats={[
        { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-500' },
        { label: 'Applications', value: stats.applications, icon: FileText, color: 'bg-coral-500' },
        { label: 'Total Deposits', value: stats.deposits, icon: Landmark, color: 'bg-purple-500' },
        { label: 'Active Deposits', value: stats.activeDeposits, icon: DollarSign, color: 'bg-emerald-500' },
      ]} />

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy">Recent Applications</h2>
          <Link to="/admin/applications" className="text-sm text-coral-500 font-medium hover:text-coral-600 inline-flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentApps.map((app) => (
            <Link
              key={app.id}
              to={`/admin/applications/${app.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-navy">{app.property_address_line_1}{app.property_suburb ? `, ${app.property_suburb}` : ''}</p>
                <p className="text-xs text-gray-400">{new Date(app.created_at).toLocaleDateString('en-AU')}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                app.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {app.status}
              </span>
            </Link>
          ))}
          {recentApps.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No applications yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
