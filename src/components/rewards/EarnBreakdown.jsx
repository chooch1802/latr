import { CreditCard, TrendingUp, Users, ShieldCheck, Receipt, Calendar, Award, Star } from 'lucide-react'
import PointsEarnCard from './PointsEarnCard'

const earnMethods = [
  { icon: CreditCard, title: 'On-time Repayments', description: 'Earn 1-5x points per dollar based on your plan.', points: '1-5x/dollar', color: 'bg-emerald-50 text-emerald-500' },
  { icon: TrendingUp, title: 'Round Ups', description: 'Bonus points on spare change contributions.', points: '1pt/dollar', color: 'bg-amber-50 text-amber-500' },
  { icon: Users, title: 'Refer a Friend', description: 'Earn when your referral completes onboarding.', points: '250-1,000', color: 'bg-blue-50 text-blue-500' },
  { icon: ShieldCheck, title: 'Complete KYC', description: 'One-time bonus for identity verification.', points: '500', color: 'bg-purple-50 text-purple-500' },
  { icon: Receipt, title: 'Pay Bills', description: 'Points for every household bill paid on time.', points: '50', color: 'bg-teal-50 text-teal-500' },
  { icon: Calendar, title: 'Rent Day', description: 'Monthly bonus multipliers and raffle entries.', points: '2-3x', color: 'bg-coral-50 text-coral-500' },
  { icon: Award, title: 'Payment Streaks', description: 'Bonus for consecutive weeks of on-time payments.', points: '100-500', color: 'bg-orange-50 text-orange-500' },
  { icon: Star, title: 'Sign Up Bonus', description: 'Welcome points when you join LATR Rewards.', points: '100', color: 'bg-pink-50 text-pink-500' },
]

export default function EarnBreakdown() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-navy mb-3">Ways to Earn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {earnMethods.map((method) => (
          <PointsEarnCard key={method.title} {...method} />
        ))}
      </div>
    </div>
  )
}
