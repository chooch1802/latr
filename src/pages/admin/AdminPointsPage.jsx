import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import AdminPointsAdjustForm from '../../components/admin/AdminPointsAdjustForm'

export default function AdminPointsPage() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [lookup, setLookup] = useState('')
  const [userBalance, setUserBalance] = useState(null)

  async function handleAdjust({ userId, points, reason }) {
    setError('')
    setResult(null)

    try {
      const res = await supabase.functions.invoke('rewards-admin-adjust', {
        body: { userId, points, reason },
      })
      if (res.error) throw new Error(res.error.message)
      setResult(res.data)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleLookup() {
    if (!lookup) return
    setUserBalance(null)
    const { data } = await supabase
      .from('reward_balances')
      .select('*, users:user_id(first_name, last_name, email, phone)')
      .eq('user_id', lookup)
      .maybeSingle()
    setUserBalance(data)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Points Management</h1>

      {/* User lookup */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-navy mb-3">User Lookup</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder="Paste user UUID"
            className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20"
          />
          <button
            onClick={handleLookup}
            className="h-10 px-4 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition-colors cursor-pointer"
          >
            Look up
          </button>
        </div>

        {userBalance && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-navy">
                {userBalance.users?.first_name} {userBalance.users?.last_name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Available Points</span>
              <span className="font-bold text-coral-500">{userBalance.available_points?.toLocaleString('en-AU')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lifetime Points</span>
              <span className="font-medium">{userBalance.lifetime_points?.toLocaleString('en-AU')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tier</span>
              <span className="font-medium capitalize">{userBalance.current_tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Streak</span>
              <span className="font-medium">{userBalance.streak_weeks} weeks</span>
            </div>
          </div>
        )}
      </div>

      {/* Adjust form */}
      <AdminPointsAdjustForm onSubmit={handleAdjust} />

      {result && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
          Adjustment applied. New balance: {JSON.stringify(result)}
        </div>
      )}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}
