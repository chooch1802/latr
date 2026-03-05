import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Gift, ArrowRight, History, Users, ShoppingBag, MapPin } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getRewardBalance, getRewardTiers, getRewardTransactions } from '../lib/rewardsApi'
import TierBadge from '../components/rewards/TierBadge'
import TierProgressBar from '../components/rewards/TierProgressBar'
import RewardTransactionRow from '../components/rewards/RewardTransactionRow'
import EarnBreakdown from '../components/rewards/EarnBreakdown'

export default function RewardsPage() {
  const { profile } = useAuth()
  const [balance, setBalance] = useState(null)
  const [tiers, setTiers] = useState([])
  const [recentTxns, setRecentTxns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [bal, tierData, txnData] = await Promise.all([
          getRewardBalance(),
          getRewardTiers(),
          getRewardTransactions({ limit: 5 }),
        ])
        setBalance(bal)
        setTiers(tierData)
        setRecentTxns(txnData.transactions)
      } catch {
        // Will show empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="h-60 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  const currentTier = balance?.current_tier || 'bronze'
  const tierConfig = tiers.find((t) => t.slug === currentTier)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-navy mb-6">Rewards</h1>

      {/* Points balance card */}
      <div className="bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl p-6 text-white mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-white/80 text-sm font-medium">Available Points</p>
          <TierBadge tier={currentTier} />
        </div>
        <p className="text-4xl font-bold mb-1">
          {(balance?.available_points || 0).toLocaleString('en-AU')}
        </p>
        <p className="text-white/60 text-sm mb-4">
          {(balance?.lifetime_points || 0).toLocaleString('en-AU')} lifetime points
        </p>

        <div className="flex gap-2">
          <Link
            to="/rewards/redeem"
            className="flex items-center gap-1.5 h-10 px-4 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Redeem
          </Link>
          <Link
            to="/rewards/history"
            className="flex items-center gap-1.5 h-10 px-4 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
          >
            <History className="w-4 h-4" />
            History
          </Link>
        </div>
      </div>

      {/* Tier progress */}
      <div className="mb-4">
        <TierProgressBar
          currentTier={currentTier}
          qualifyingPoints={balance?.tier_qualifying_points || 0}
        />
      </div>

      {/* CTA cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link
          to="/rewards/refer"
          className="group block rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm hover:border-gray-300 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-sm font-semibold text-navy group-hover:text-coral-500 transition-colors">Refer a Friend</h3>
          <p className="text-xs text-gray-500">Earn up to 1,000 pts</p>
        </Link>
        <Link
          to="/rewards/neighbourhood"
          className="group block rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm hover:border-gray-300 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
            <MapPin className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-sm font-semibold text-navy group-hover:text-coral-500 transition-colors">Neighbourhood</h3>
          <p className="text-xs text-gray-500">Earn at local partners</p>
        </Link>
      </div>

      {/* Streak */}
      {balance && balance.streak_weeks > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-navy">Payment Streak</p>
              <p className="text-xs text-gray-500">Consecutive on-time weeks</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-coral-500">{balance.streak_weeks}</p>
              <p className="text-xs text-gray-400">Best: {balance.longest_streak}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-navy">Recent Activity</h2>
          <Link to="/rewards/history" className="text-sm font-medium text-coral-500 hover:text-coral-600 transition-colors inline-flex items-center gap-1">
            See all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentTxns.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Gift className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No rewards activity yet. Make a repayment or complete KYC to start earning!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {recentTxns.map((txn) => (
              <RewardTransactionRow key={txn.id} transaction={txn} />
            ))}
          </div>
        )}
      </div>

      {/* Earn breakdown */}
      <EarnBreakdown />

      {/* Tier perks */}
      {tierConfig && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-navy mb-3">Your {tierConfig.display_name} Perks</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <ul className="space-y-2">
              {(tierConfig.perks || []).map((perk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-coral-500 mt-0.5">&#10003;</span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
