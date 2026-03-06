import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, Crown, Loader2 } from 'lucide-react'
import { getRewardBalance, getRewardTiers, getTierSubscription, createTierSubscription, cancelTierSubscription } from '../lib/rewardsApi'

const tierGradients = {
  silver: 'from-gray-400 to-gray-500',
  gold: 'from-yellow-400 to-amber-500',
  platinum: 'from-purple-400 to-purple-600',
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
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-72 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const isCurrentTier = tier.slug === currentTier
          const tierIdx = ['silver', 'gold', 'platinum'].indexOf(tier.slug)
          const currentIdx = ['silver', 'gold', 'platinum'].indexOf(currentTier)
          const isDowngrade = tierIdx < currentIdx
          const isUpgrade = tierIdx > currentIdx
          const gradient = tierGradients[tier.slug] || tierGradients.silver
          const annualPrice = tier.annual_fee ? `$${(tier.annual_fee / 100).toLocaleString('en-AU')}` : null

          return (
            <div
              key={tier.slug}
              className={`relative bg-white rounded-2xl border p-5 transition-all ${
                isCurrentTier ? 'border-coral-300 shadow-md ring-1 ring-coral-200' : 'border-gray-200 hover:shadow-sm'
              }`}
            >
              {isCurrentTier && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-coral-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4 mt-2`}>
                <Crown className="w-6 h-6 text-white" />
              </div>

              <h2 className="text-xl font-bold text-navy text-center mb-1 capitalize">{tier.display_name}</h2>
              <p className="text-center text-2xl font-bold text-navy mb-0.5">
                {annualPrice ? `${annualPrice}` : 'Free'}
                {annualPrice && <span className="text-sm font-normal text-gray-400">/year</span>}
              </p>
              <p className="text-center text-sm text-gray-500 mb-4">
                {tier.points_per_dollar_repayment}x points per dollar
              </p>

              <ul className="space-y-2 mb-5">
                {(tier.perks || []).map((perk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-coral-500 mt-0.5 shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
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
                      <p className="text-xs text-center text-amber-600">Cancels at period end</p>
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
                    className="w-full h-10 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 transition-all disabled:opacity-50"
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
          )
        })}
      </div>
    </div>
  )
}
