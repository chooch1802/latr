import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const STATUS_OPTIONS = ['all', 'draft', 'submitted', 'approved', 'rejected']

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      let query = supabase
        .from('applications')
        .select('id, user_id, property_address_line_1, property_suburb, property_state, deposit_amount, status, created_at, users:user_id (first_name, last_name, email)')
        .order('created_at', { ascending: false })
        .limit(100)

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data } = await query
      setApps(data || [])
      setLoading(false)
    }
    load()
  }, [filter])

  const filtered = search
    ? apps.filter((a) => {
        const s = search.toLowerCase()
        return (
          a.property_address_line_1?.toLowerCase().includes(s) ||
          a.property_suburb?.toLowerCase().includes(s) ||
          (a.users?.first_name || '').toLowerCase().includes(s) ||
          (a.users?.last_name || '').toLowerCase().includes(s)
        )
      })
    : apps

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Applications</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by address or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500"
          />
        </div>
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 text-sm rounded-lg font-medium capitalize cursor-pointer transition-colors ${
                filter === s ? 'bg-coral-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Property</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Applicant</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Deposit</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/admin/applications/${app.id}`} className="text-navy font-medium hover:text-coral-500">
                      {app.property_address_line_1}
                      {app.property_suburb ? `, ${app.property_suburb}` : ''}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {app.users?.first_name} {app.users?.last_name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    ${Number(app.deposit_amount || 0).toLocaleString('en-AU')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                      app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      app.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(app.created_at).toLocaleDateString('en-AU')}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No applications found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
