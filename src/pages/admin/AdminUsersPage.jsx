import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, phone, kyc_status, role, stripe_mandate_status, onboarding_step, equifax_score, created_at')
        .order('created_at', { ascending: false })
        .limit(100)
      setUsers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
        {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Users</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">KYC</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Payment</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Equifax</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Onboarding</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-navy font-medium">
                  {u.first_name || ''} {u.last_name || ''}
                  {!u.first_name && !u.last_name && <span className="text-gray-400">Unnamed</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{u.email || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{u.phone || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                    u.kyc_status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                    u.kyc_status === 'processing' ? 'bg-amber-100 text-amber-700' :
                    u.kyc_status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {u.kyc_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                    u.stripe_mandate_status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {u.stripe_mandate_status || 'none'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {u.equifax_score != null ? (
                    <span className={`font-medium ${u.equifax_score >= 700 ? 'text-emerald-600' : u.equifax_score >= 400 ? 'text-amber-600' : 'text-red-600'}`}>
                      {u.equifax_score}
                    </span>
                  ) : (
                    <span className="text-gray-400">&mdash;</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {u.onboarding_step >= 5 ? (
                    <span className="text-emerald-600 font-medium">Complete</span>
                  ) : (
                    <span>Step {u.onboarding_step}/5</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(u.created_at).toLocaleDateString('en-AU')}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">No users yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
