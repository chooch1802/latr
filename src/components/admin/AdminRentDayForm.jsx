import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminRentDayForm({ event, onSubmit }) {
  const now = new Date()
  const [month, setMonth] = useState(event?.month || now.getMonth() + 1)
  const [year, setYear] = useState(event?.year || now.getFullYear())
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [multiplier, setMultiplier] = useState(event?.bonus_multiplier || 2)
  const [maxAmount, setMaxAmount] = useState(event?.free_rent_max_amount || 2500)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({ month, year, title, description, bonus_multiplier: multiplier, free_rent_max_amount: maxAmount })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold text-navy">{event ? 'Edit Event' : 'Create Rent Day Event'}</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString('en-AU', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. March Rent Day" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Multiplier</label>
          <input type="number" step="0.5" value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Free Rent ($)</label>
          <input type="number" value={maxAmount} onChange={(e) => setMaxAmount(Number(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm" />
        </div>
      </div>

      <button type="submit" disabled={submitting} className="h-10 px-6 bg-coral-500 text-white font-semibold rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2">
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : event ? 'Update Event' : 'Create Event'}
      </button>
    </form>
  )
}
