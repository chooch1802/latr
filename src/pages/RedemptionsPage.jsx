import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Gift, CreditCard, Plane, Dumbbell, UtensilsCrossed, Home } from 'lucide-react'
import { getUserRedemptions } from '../lib/rewardsApi'
import RedemptionStatusBadge from '../components/rewards/RedemptionStatusBadge'

const categoryIcons = {
  rent_credit: CreditCard,
  home_deposit: Home,
  gift_card: Gift,
  travel: Plane,
  fitness: Dumbbell,
  dining: UtensilsCrossed,
}

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserRedemptions()
        setRedemptions(data)
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/rewards/redeem" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">My Redemptions</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : redemptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-3">No redemptions yet.</p>
          <Link
            to="/rewards/redeem"
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-coral-500 text-white text-sm font-semibold rounded-xl hover:bg-coral-600 transition-colors"
          >
            Browse catalog
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {redemptions.map((r) => {
            const Icon = categoryIcons[r.category] || Gift
            return (
              <div key={r.id} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy capitalize">
                    {r.category.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {r.gift_card_retailer && ` · ${r.gift_card_retailer}`}
                    {r.travel_program && ` · ${r.travel_program.charAt(0).toUpperCase() + r.travel_program.slice(1)}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-navy">${r.dollar_value}</p>
                  <p className="text-xs text-gray-400">{r.points_spent.toLocaleString('en-AU')} pts</p>
                </div>
                <RedemptionStatusBadge status={r.status} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
