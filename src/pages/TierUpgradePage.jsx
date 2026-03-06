import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'
import { getRewardBalance, getRewardTiers, getTierSubscription, createTierSubscription, cancelTierSubscription } from '../lib/rewardsApi'

const tierConfig = {
  silver: {
    gradient: 'from-gray-400 to-gray-500',
    repaymentRewards: [
      { label: 'Repayments', value: '1X', suffix: 'points per dollar' },
    ],
    exclusiveRewards: [
      { label: 'Referral bonus', value: '250 pts' },
    ],
    benefits: [
      'Gift card & rent credit redemptions',
      'Monthly Rent Day participation',
      'Neighbourhood partner rewards',
    ],
  },
  gold: {
    gradient: 'from-yellow-400 to-amber-500',
    repaymentRewards: [
      { label: 'Repayments', value: '2X', suffix: 'points per dollar' },
      { label: 'Round-ups', value: '+10%', suffix: 'bonus' },
    ],
    exclusiveRewards: [
      { label: 'Referral bonus', value: '500 pts' },
      { label: 'Annual value', value: '$50', detail: 'in fitness credits' },
    ],
    benefits: [
      'Everything in Silver',
      'Priority Rent Day offers & 2x multiplier',
      'Fitness class credits',
      'Qantas & Velocity transfer access',
    ],
  },
  platinum: {
    gradient: 'from-purple-400 to-purple-600',
    repaymentRewards: [
      { label: 'Repayments', value: '5X', suffix: 'points per dollar' },
      { label: 'Round-ups', value: '+10%', suffix: 'bonus' },
      { label: 'Rent Day', value: '3X', suffix: 'multiplier' },
    ],
    exclusiveRewards: [
      { label: 'Referral bonus', value: '1,000 pts' },
      { label: 'Annual value', value: '$200+', detail: 'concierge & priority perks' },
    ],
    benefits: [
      'Everything in Gold',
      'Premium travel transfer rates',
      'Concierge support',
      'Free monthly rent raffle entry',
      'Exclusive partner offers',
    ],
  },
}

export default function TierUpgradePage() {
  const [searchParams] = useSearchParams()
  const [balance, setBalance] = useState(null)
  const [tiers, setTiers] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setMessage({ type: 'success', text: 'Subscription activated! Your new tier perks are now active.' })
    } else if (searchParams.get('cancelled') === 'true') {
      setMessage({ type: 'info', text: 'Checkout was cancelled. No changes were made.' })
    }
  }, [searchParams])

  useEffect(() => {
    async function load() {
      try {
        const [bal, tierData, sub] = await Promise.all([
          getRewardBalance(),
          getRewardTiers(),
          getTierSubscription(),
        ])
        setBalance(bal)
        setTiers(tierData)
        setSubscription(sub)
      } catch {
        // Will show empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const currentTier = balance?.current_tier || 'silver'

  async function handleSubscribe(tierSlug) {
    setSubscribing(tierSlug)
    try {
      const { url } = await createTierSubscription(tierSlug)
      if (url) window.location.href = url
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
      setSubscribing(null)
    }
  }

  async function handleCancel() {
    setCancelling(true)
    try {
      const result = await cancelTierSubscription()
      setSubscription((prev) => prev ? { ...prev, status: 'cancelled', cancelled_at: new Date().toISOString() } : prev)
      setMessage({
        type: 'success',
        text: result.cancels_at
          ? `Subscription will end on ${new Date(result.cancels_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}. You'll keep your perks until then.`
          : 'Subscription cancelled.',
      })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-[580px] bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/rewards" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">Choose Your Plan</h1>
      </div>

      {message && (
        <div className={`rounded-xl px-4 py-3 mb-6 text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' :
          message.type === 'error' ? 'bg-red-50 text-red-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isCurrentTier = tier.slug === currentTier
          const tierIdx = ['silver', 'gold', 'platinum'].indexOf(tier.slug)
          const currentIdx = ['silver', 'gold', 'platinum'].indexOf(currentTier)
          const isDowngrade = tierIdx < currentIdx
          const isUpgrade = tierIdx > currentIdx
          const annualPrice = tier.annual_fee ? `$${(tier.annual_fee / 100).toLocaleString('en-AU')}` : null
          const config = tierConfig[tier.slug] || tierConfig.silver

          return (
            <div
              key={tier.slug}
              className={`relative bg-white rounded-2xl border transition-all flex flex-col ${
                isCurrentTier ? 'border-coral-300 shadow-lg ring-1 ring-coral-200' : 'border-gray-200 hover:shadow-md'
              }`}
            >
              {isCurrentTier && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-coral-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                    Current Plan
                  </span>
                </div>
              )}

              {/* Section A: Header + Price + CTA */}
              <div className="p-5 pb-4 text-center">
                <h2 className="text-xl font-bold text-navy capitalize mt-1">{tier.display_name}</h2>
                <p className="text-3xl font-bold text-navy mt-1">
                  {annualPrice || 'Free'}
                  {annualPrice && <span className="text-sm font-normal text-gray-400">/year</span>}
                </p>

                <div className="mt-3">
                  {isCurrentTier ? (
                    <>
                      {subscription?.status === 'active' && tier.slug !== 'silver' && (
                        <button
                          onClick={handleCancel}
                          disabled={cancelling}
                          className="w-full h-10 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          {cancelling ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                          ) : (
                            'Cancel Subscription'
                          )}
                        </button>
                      )}
                      {subscription?.status === 'cancelled' && (
                        <p className="text-xs text-amber-600 py-2">Cancels at period end</p>
                      )}
                      {tier.slug === 'silver' && !subscription && (
                        <div className="h-10 flex items-center justify-center text-sm text-gray-400">
                          Included free
                        </div>
                      )}
                    </>
                  ) : isUpgrade ? (
                    <button
                      onClick={() => handleSubscribe(tier.slug)}
                      disabled={subscribing === tier.slug}
                      className="w-full h-10 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 transition-all disabled:opacity-50 shadow-sm"
                    >
                      {subscribing === tier.slug ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        currentTier === 'silver' ? 'Subscribe' : 'Upgrade'
                      )}
                    </button>
                  ) : isDowngrade ? (
                    <div className="h-10 flex items-center justify-center text-xs text-gray-400">
                      Cancel current plan to downgrade
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-gray-100 mx-5" />

              {/* Section B: Repayment Rewards */}
              <div className="px-5 pt-4 pb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Repayment rewards</p>
                <div className="space-y-2">
                  {config.repaymentRewards.map((reward) => (
                    <div
                      key={reward.label}
                      className="bg-navy rounded-xl px-4 py-3 flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-300">{reward.label}</span>
                      <span className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-white">{reward.value}</span>
                        <span className="text-xs text-gray-400">{reward.suffix}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 mx-5" />

              {/* Section C: LATR-exclusive Rewards */}
              <div className="px-5 pt-4 pb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">LATR-exclusive rewards</p>
                <div className="space-y-2">
                  {config.exclusiveRewards.map((reward) => (
                    <div
                      key={reward.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{reward.label}</span>
                      <span className="font-bold text-navy">
                        {reward.value}
                        {reward.detail && (
                          <span className="font-normal text-xs text-gray-400 ml-1">{reward.detail}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 mx-5" />

              {/* Section D: Featured Benefits */}
              <div className="px-5 pt-4 pb-5 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Featured benefits</p>
                <ul className="space-y-2.5">
                  {config.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-coral-500 mt-0.5 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
