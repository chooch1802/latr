import { Gift, TrendingUp, CreditCard, Users, ShieldCheck, Receipt, Calendar, Award, Star, ArrowRight } from 'lucide-react'

const categoryIcons = {
  repayment_ontime: { icon: CreditCard, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  repayment_early: { icon: CreditCard, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  roundup: { icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-500' },
  referral_sent: { icon: Users, bg: 'bg-blue-50', color: 'text-blue-500' },
  referral_received: { icon: Users, bg: 'bg-blue-50', color: 'text-blue-500' },
  kyc_completed: { icon: ShieldCheck, bg: 'bg-purple-50', color: 'text-purple-500' },
  bill_paid: { icon: Receipt, bg: 'bg-teal-50', color: 'text-teal-500' },
  rent_day_bonus: { icon: Calendar, bg: 'bg-coral-50', color: 'text-coral-500' },
  rent_day_multiplier: { icon: Calendar, bg: 'bg-coral-50', color: 'text-coral-500' },
  streak_bonus: { icon: Award, bg: 'bg-orange-50', color: 'text-orange-500' },
  signup_bonus: { icon: Star, bg: 'bg-pink-50', color: 'text-pink-500' },
  tier_bonus: { icon: Award, bg: 'bg-yellow-50', color: 'text-yellow-500' },
  promotion: { icon: Gift, bg: 'bg-coral-50', color: 'text-coral-500' },
  card_linked_offer: { icon: CreditCard, bg: 'bg-blue-50', color: 'text-blue-500' },
  card_linked_reversal: { icon: CreditCard, bg: 'bg-red-50', color: 'text-red-500' },
  admin_adjustment: { icon: Gift, bg: 'bg-gray-50', color: 'text-gray-500' },
  // Redemptions
  redemption_rent_credit: { icon: ArrowRight, bg: 'bg-red-50', color: 'text-red-500' },
  redemption_gift_card: { icon: Gift, bg: 'bg-red-50', color: 'text-red-500' },
  redemption_travel: { icon: ArrowRight, bg: 'bg-red-50', color: 'text-red-500' },
  redemption_fitness: { icon: ArrowRight, bg: 'bg-red-50', color: 'text-red-500' },
  redemption_dining: { icon: ArrowRight, bg: 'bg-red-50', color: 'text-red-500' },
  redemption_home_deposit: { icon: ArrowRight, bg: 'bg-red-50', color: 'text-red-500' },
}

export default function RewardTransactionRow({ transaction }) {
  const config = categoryIcons[transaction.category] || { icon: Gift, bg: 'bg-gray-50', color: 'text-gray-500' }
  const Icon = config.icon
  const isPositive = transaction.points > 0

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-navy truncate">
          {transaction.description || transaction.category.replace(/_/g, ' ')}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(transaction.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
          {transaction.multiplier > 1 && ` · ${transaction.multiplier}x`}
        </p>
      </div>
      <span className={`text-sm font-bold shrink-0 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
        {isPositive ? '+' : ''}{transaction.points.toLocaleString('en-AU')}
      </span>
    </div>
  )
}
