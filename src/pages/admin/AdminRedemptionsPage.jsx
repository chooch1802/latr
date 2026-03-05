import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminRedemptionReviewCard from '../../components/admin/AdminRedemptionReviewCard'

export default function AdminRedemptionsPage() {
  const [redemptions, setRedemptions] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)

  async function loadRedemptions() {
    setLoading(true)
    let query = supabase
      .from('redemptions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (filter) query = query.eq('status', filter)

    const { data } = await query
    setRedemptions(data || [])
    setLoading(false)
  }

  useEffect(() => { loadRedemptions() }, [filter])

  async function handleReview(redemptionId, action, notes) {
    await supabase.functions.invoke('rewards-admin-review-redemption', {
      body: { redemptionId, action, notes },
    })
    loadRedemptions()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Redemption Review</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'completed', 'rejected', ''].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 px-3 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              filter === f ? 'bg-coral-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : redemptions.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No redemptions found.</p>
      ) : (
        <div className="space-y-3">
          {redemptions.map((r) => (
            <AdminRedemptionReviewCard
              key={r.id}
              redemption={r}
              onReview={handleReview}
            />
          ))}
        </div>
      )}
    </div>
  )
}
