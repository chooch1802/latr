import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Gift } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { getCurrentRentDayEvent } from '../lib/rewardsApi'
import RentDayCountdown from '../components/rewards/RentDayCountdown'
import FreeRentRaffle from '../components/rewards/FreeRentRaffle'
import RentDayOffers from '../components/rewards/RentDayOffers'

export default function RentDayPage() {
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [userEntry, setUserEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      const ev = await getCurrentRentDayEvent()
      setEvent(ev)

      if (ev && user) {
        const { data } = await supabase
          .from('rent_day_entries')
          .select('*')
          .eq('event_id', ev.id)
          .eq('user_id', user.id)
          .maybeSingle()
        setUserEntry(data)
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  const isActive = event?.status === 'active'
  const isToday = new Date().getDate() === 1

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/rewards" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">Rent Day</h1>
      </div>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-semibold text-white/80">
            {isActive ? 'Rent Day is LIVE!' : 'Next event on the 1st'}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{event?.title || 'Rent Day'}</h2>
        <p className="text-white/70 text-sm mb-3">
          {event?.description || 'Every 1st of the month, earn bonus multipliers on all activity, enter the free rent raffle, and access exclusive partner offers.'}
        </p>
        {isActive && (
          <div className="bg-white/20 rounded-xl px-4 py-2 inline-flex items-center gap-2">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-bold">{event.bonus_multiplier}x points multiplier active</span>
          </div>
        )}
      </div>

      {/* Countdown (show when event is NOT active) */}
      {!isActive && (
        <div className="mb-6">
          <RentDayCountdown />
        </div>
      )}

      {/* Free Rent Raffle */}
      {event && event.free_rent_enabled && (
        <div className="mb-6">
          <FreeRentRaffle
            event={event}
            userEntry={userEntry}
            onEntrySuccess={loadData}
          />
        </div>
      )}

      {/* Special Offers */}
      {event?.special_offers && (
        <div className="mb-6">
          <RentDayOffers offers={event.special_offers} />
        </div>
      )}

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-navy mb-3">How Rent Day Works</h3>
        <div className="space-y-3">
          {[
            { num: '1', text: 'Every 1st of the month is Rent Day' },
            { num: '2', text: 'All points earned that day get a bonus multiplier' },
            { num: '3', text: 'Enter the free rent raffle for a chance to win' },
            { num: '4', text: 'Access exclusive partner deals and offers' },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-coral-50 text-coral-500 text-xs font-bold flex items-center justify-center shrink-0">
                {step.num}
              </span>
              <p className="text-sm text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
