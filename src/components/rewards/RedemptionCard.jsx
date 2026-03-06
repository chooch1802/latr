import { Link } from 'react-router-dom'
import { Gift, CreditCard, Plane, Dumbbell, UtensilsCrossed, Home } from 'lucide-react'

const categoryIcons = {
  rent_credit: { icon: CreditCard, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  home_deposit: { icon: Home, bg: 'bg-blue-50', color: 'text-blue-500' },
  gift_card: { icon: Gift, bg: 'bg-purple-50', color: 'text-purple-500' },
  travel: { icon: Plane, bg: 'bg-sky-50', color: 'text-sky-500' },
  fitness: { icon: Dumbbell, bg: 'bg-orange-50', color: 'text-orange-500' },
  dining: { icon: UtensilsCrossed, bg: 'bg-pink-50', color: 'text-pink-500' },
}

export default function RedemptionCard({ item }) {
  const config = categoryIcons[item.category] || categoryIcons.gift_card
  const Icon = config.icon

  return (
    <Link
      to={`/rewards/redeem/${item.id}`}
      className="group block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm hover:border-gray-300 transition-all"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${config.bg}`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <h3 className="text-sm font-semibold text-navy group-hover:text-coral-500 transition-colors mb-0.5">
        {item.name}
      </h3>
      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-coral-500">
          {item.points_cost.toLocaleString('en-AU')} pts
        </span>
        {item.min_tier !== 'silver' && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 capitalize">
            {item.min_tier}+
          </span>
        )}
      </div>
    </Link>
  )
}
