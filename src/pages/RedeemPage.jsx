import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { getRedemptionCatalog, getRewardBalance } from '../lib/rewardsApi'
import RedemptionCard from '../components/rewards/RedemptionCard'
import RedemptionCategoryNav from '../components/rewards/RedemptionCategoryNav'

const tierOrder = ['silver', 'gold', 'platinum']

export default function RedeemPage() {
  const [catalog, setCatalog] = useState([])
  const [balance, setBalance] = useState(null)
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [items, bal] = await Promise.all([
          getRedemptionCatalog({ category: category || undefined }),
          getRewardBalance(),
        ])
        setCatalog(items)
        setBalance(bal)
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    setLoading(true)
    load()
  }, [category])

  const userTierIdx = tierOrder.indexOf(balance?.current_tier || 'silver')
  const availableItems = catalog.filter((item) => {
    const itemTierIdx = tierOrder.indexOf(item.min_tier)
    return itemTierIdx <= userTierIdx
  })
  const lockedItems = catalog.filter((item) => {
    const itemTierIdx = tierOrder.indexOf(item.min_tier)
    return itemTierIdx > userTierIdx
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/rewards" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">Redeem Points</h1>
      </div>

      {/* Balance display */}
      {balance && (
        <div className="bg-coral-50 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Available balance</span>
          <span className="text-lg font-bold text-coral-500">
            {balance.available_points.toLocaleString('en-AU')} pts
          </span>
        </div>
      )}

      {/* Category filter */}
      <div className="mb-4">
        <RedemptionCategoryNav value={category} onChange={setCategory} />
      </div>

      {/* My Redemptions link */}
      <div className="mb-4">
        <Link
          to="/rewards/redemptions"
          className="text-sm font-medium text-coral-500 hover:text-coral-600 transition-colors"
        >
          View my redemptions &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : catalog.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No redemption options available in this category.</p>
        </div>
      ) : (
        <>
          {/* Available items */}
          {availableItems.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {availableItems.map((item) => (
                <RedemptionCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Locked items */}
          {lockedItems.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-gray-400 mb-3">Unlock with higher tier</h2>
              <div className="grid grid-cols-2 gap-3 opacity-50">
                {lockedItems.map((item) => (
                  <RedemptionCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
