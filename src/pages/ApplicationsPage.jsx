import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Search, Plus, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import ApplicationStatusBadge from '../components/applications/ApplicationStatusBadge'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
]

export default function ApplicationsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchApplications() {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setApplications(data || [])
      } catch (err) {
        toast.error('Failed to load applications. Please try again.')
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [user.id])

  const filtered = applications.filter((app) => {
    if (statusFilter && app.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const addr = `${app.property_address_line_1 || ''} ${app.property_suburb || ''} ${app.property_state || ''}`.toLowerCase()
      if (!addr.includes(q)) return false
    }
    return true
  })

  // Quick stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => ['submitted', 'under_review'].includes(a.status)).length,
    approved: applications.filter((a) => a.status === 'approved').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">My Applications</h1>
          <p className="text-gray-500">Track and manage your rental applications.</p>
        </div>
        <Link
          to="/properties"
          className="hidden sm:inline-flex items-center gap-2 h-10 px-4 bg-coral-500 text-white text-sm font-semibold rounded-xl transition-colors hover:bg-coral-600"
        >
          <Plus className="w-4 h-4" />
          New Application
        </Link>
      </div>

      {/* Stats */}
      {applications.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} color="text-amber-600" />
          <StatCard label="Approved" value={stats.approved} color="text-emerald-600" />
        </div>
      )}

      {/* Filters */}
      {applications.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by property address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:border-coral-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === f.value
                    ? 'bg-coral-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Applications list */}
      {error ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-navy mb-1">Failed to load applications</h2>
          <p className="text-gray-500 text-sm mb-4">Something went wrong. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="h-10 px-5 bg-coral-500 text-white font-medium rounded-xl text-sm hover:bg-coral-600 transition-colors cursor-pointer inline-flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((app) => (
            <Link
              key={app.id}
              to={`/apply/${app.id}`}
              className="group block bg-white rounded-xl border border-gray-200 p-4 transition-all hover:shadow-soft hover:border-gray-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-navy truncate">
                      {app.property_address_line_1 || 'Draft Application'}
                      {app.property_suburb ? `, ${app.property_suburb}` : ''}
                    </p>
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {app.property_type ? `${app.property_type} · ` : ''}
                    {app.deposit_amount
                      ? `$${Number(app.deposit_amount).toLocaleString('en-AU')} deposit · `
                      : ''}
                    {new Date(app.created_at).toLocaleDateString('en-AU')}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-coral-500 transition-colors shrink-0 ml-4" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-navy mb-1">
            {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            {applications.length === 0
              ? 'Browse properties and submit your first application.'
              : 'Try adjusting your filters.'}
          </p>
          {applications.length === 0 && (
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 h-10 px-4 bg-coral-500 text-white text-sm font-semibold rounded-xl transition-colors hover:bg-coral-600"
            >
              Browse Properties
            </Link>
          )}
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        to="/properties"
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-coral-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-coral-600 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  )
}

function StatCard({ label, value, color = 'text-navy' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}
