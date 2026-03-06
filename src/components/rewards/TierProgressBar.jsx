import { Link } from 'react-router-dom'
import { Crown, ArrowRight } from 'lucide-react'

const tierColors = {
  silver: 'from-gray-400 to-gray-500',
  gold: 'from-yellow-400 to-amber-500',
  platinum: 'from-purple-400 to-purple-600',
}

const tierMultipliers = { silver: '1x', gold: '2x', platinum: '5x' }

export default function TierProgressBar({ currentTier = 'silver', subscription }) {
  const gradient = tierColors[currentTier] || tierColors.silver
  const multiplier = tierMultipliers[currentTier] || '1x'
  const renewalDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy capitalize">{currentTier} Plan</p>
            <p className="text-xs text-gray-500">Earning {multiplier} points per dollar</p>
          </div>
        </div>
        {currentTier !== 'platinum' && (
          <Link
            to="/rewards/upgrade"
            className="flex items-center gap-1 text-xs font-semibold text-coral-500 hover:text-coral-600 transition-colors"
          >
            Upgrade <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {subscription?.status === 'cancelled' && renewalDate && (
        <p className="text-xs text-amber-600 mt-1">
          Cancels on {renewalDate} — you&apos;ll keep your perks until then.
        </p>
      )}
      {subscription?.status === 'active' && renewalDate && currentTier !== 'silver' && (
        <p className="text-xs text-gray-400 mt-1">Renews {renewalDate}</p>
      )}
      {subscription?.status === 'past_due' && (
        <p className="text-xs text-red-500 mt-1">
          Payment failed — please update your payment method.
        </p>
      )}
    </div>
  )
}
