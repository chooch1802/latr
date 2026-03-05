import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Gift } from 'lucide-react'
import { getCurrentRentDayEvent } from '../../lib/rewardsApi'

export default function RentDayBanner() {
  const [event, setEvent] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    getCurrentRentDayEvent()
      .then((e) => {
        if (e && e.status === 'active') setEvent(e)
      })
      .catch(() => {})
  }, [])

  if (!event || dismissed) return null

  return (
    <div className="bg-gradient-to-r from-coral-500 to-coral-600 text-white px-4 py-2.5 flex items-center justify-between gap-3">
      <Link to="/rewards/rent-day" className="flex items-center gap-2 flex-1 min-w-0">
        <Gift className="w-4 h-4 shrink-0" />
        <span className="text-sm font-semibold truncate">
          It&apos;s Rent Day! {event.bonus_multiplier}x points all day
        </span>
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}
