import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminPointsAdjustForm({ onSubmit }) {
  const [userId, setUserId] = useState('')
  const [points, setPoints] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!userId || !points || !reason) return
    setSubmitting(true)
    try {
      await onSubmit({ userId, points: Number(points), reason })
      setUserId('')
      setPoints('')
      setReason('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold text-navy">Adjust Points</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="UUID of user"
          className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Points (negative to deduct)</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          placeholder="e.g. 500 or -200"
          className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for adjustment"
          className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !userId || !points || !reason}
        className="h-10 px-6 bg-coral-500 text-white font-semibold rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
      >
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Apply Adjustment'}
      </button>
    </form>
  )
}
