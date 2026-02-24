import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('deposit_applications')
        .select('id, deposit_amount, plan_weeks, weekly_payment, status, transfer_status, created_at, recipient_name, users:user_id (first_name, last_name, email)')
        .order('created_at', { ascending: false })
        .limit(100)
      setDeposits(data || [])
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
      <h1 className="text-2xl font-bold text-navy mb-6">Deposit Applications</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Applicant</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Amount</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Plan</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Weekly</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Recipient</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Transfer</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deposits.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-navy font-medium">
                  {d.users?.first_name} {d.users?.last_name}
                </td>
                <td className="px-4 py-3">${Number(d.deposit_amount).toLocaleString('en-AU')}</td>
                <td className="px-4 py-3">{d.plan_weeks}w</td>
                <td className="px-4 py-3">${Number(d.weekly_payment).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-600">{d.recipient_name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                    d.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    d.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    d.status === 'approved' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                    d.transfer_status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    d.transfer_status === 'processing' ? 'bg-amber-100 text-amber-700' :
                    d.transfer_status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {d.transfer_status || 'pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(d.created_at).toLocaleDateString('en-AU')}
                </td>
              </tr>
            ))}
            {deposits.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No deposit applications yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
