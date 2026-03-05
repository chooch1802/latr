import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function AdminRedemptionReviewCard({ redemption, onReview }) {
  const [notes, setNotes] = useState('')
  const [reviewing, setReviewing] = useState(false)

  async function handleAction(action) {
    setReviewing(true)
    try {
      await onReview(redemption.id, action, notes)
    } finally {
      setReviewing(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-navy capitalize">
            {redemption.category.replace(/_/g, ' ')}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(redemption.created_at).toLocaleDateString('en-AU')}
            {' · '}User: {redemption.user_id.slice(0, 8)}...
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-coral-500">{redemption.points_spent.toLocaleString('en-AU')} pts</p>
          <p className="text-xs text-gray-400">${redemption.dollar_value}</p>
        </div>
      </div>

      {redemption.travel_program && (
        <p className="text-xs text-gray-500 mb-2">
          Transfer: {redemption.travel_program} · Member: {redemption.travel_member_id}
        </p>
      )}
      {redemption.gift_card_retailer && (
        <p className="text-xs text-gray-500 mb-2">Retailer: {redemption.gift_card_retailer}</p>
      )}

      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Review notes (optional)"
        className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-coral-500/20"
      />

      <div className="flex gap-2">
        <button
          onClick={() => handleAction('approve')}
          disabled={reviewing}
          className="flex-1 h-9 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
        >
          {reviewing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
          Approve
        </button>
        <button
          onClick={() => handleAction('reject')}
          disabled={reviewing}
          className="flex-1 h-9 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
        >
          {reviewing ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
          Reject
        </button>
      </div>
    </div>
  )
}
