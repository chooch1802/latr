import { useState } from 'react'
import { Gift, Loader2, CheckCircle2 } from 'lucide-react'
import { enterRentDayRaffle } from '../../lib/rewardsApi'

export default function FreeRentRaffle({ event, userEntry, onEntrySuccess }) {
  const [entering, setEntering] = useState(false)
  const [error, setError] = useState('')

  const hasEntered = !!userEntry
  const winner = event?.free_rent_winner_id

  async function handleEnter() {
    setEntering(true)
    setError('')
    try {
      await enterRentDayRaffle(event.id)
      onEntrySuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setEntering(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Gift className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-navy">Free Rent Raffle</h3>
          <p className="text-sm text-gray-600">
            Win up to ${(event?.free_rent_max_amount || 2500).toLocaleString('en-AU')} towards your rent!
          </p>
        </div>
      </div>

      {winner ? (
        <div className="bg-white rounded-lg p-3 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
          <p className="text-sm font-semibold text-navy">Winner has been drawn!</p>
          <p className="text-xs text-gray-500">Check your notifications to see if you won.</p>
        </div>
      ) : hasEntered ? (
        <div className="bg-white rounded-lg p-3 text-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
          <p className="text-sm font-semibold text-emerald-600">You&apos;re entered!</p>
          <p className="text-xs text-gray-500">
            {userEntry.entry_count} {userEntry.entry_count === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={handleEnter}
            disabled={entering}
            className="w-full h-11 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {entering ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Entering...</>
            ) : (
              <><Gift className="w-4 h-4" /> Enter Raffle</>
            )}
          </button>
          {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
        </>
      )}
    </div>
  )
}
