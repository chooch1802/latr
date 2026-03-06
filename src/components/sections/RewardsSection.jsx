import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Gift, Award, ShoppingBag, MapPin, Check } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'

const features = [
  {
    icon: Gift,
    title: 'Earn on Every Repayment',
    description: 'Earn 1-5x points per dollar on every on-time repayment, plus bonuses on round-ups.',
    accent: 'from-coral-500/20 to-coral-500/5',
  },
  {
    icon: Award,
    title: 'Choose Your Tier',
    description: 'Silver is free for everyone. Upgrade to Gold or Platinum for up to 5x points per dollar.',
    accent: 'from-amber-500/20 to-amber-500/5',
  },
  {
    icon: ShoppingBag,
    title: 'Redeem Your Way',
    description: 'Rent credits, gift cards, Qantas & Velocity points, fitness classes, dining credits.',
    accent: 'from-purple-500/20 to-purple-500/5',
  },
  {
    icon: MapPin,
    title: 'Neighbourhood Partners',
    description: 'Earn bonus points at 40+ local restaurants, gyms, retailers and more.',
    accent: 'from-emerald-500/20 to-emerald-500/5',
  },
]

const tiers = [
  {
    name: 'Silver',
    price: 'Free',
    multiplier: '1x',
    benefits: ['Gift card & rent credit redemptions', 'Monthly Rent Day participation', 'Neighbourhood partner rewards'],
  },
  {
    name: 'Gold',
    price: '$120/yr',
    multiplier: '2x',
    benefits: ['Priority Rent Day offers & 2x multiplier', 'Fitness class credits', 'Qantas & Velocity transfers'],
  },
  {
    name: 'Platinum',
    price: '$700/yr',
    multiplier: '5x',
    benefits: ['Premium travel transfer rates', 'Concierge support', 'Free monthly rent raffle entry', 'Exclusive partner offers'],
  },
]

export default function RewardsSection() {
  return (
    <section className="relative bg-white py-24 md:py-32 overflow-hidden" aria-labelledby="rewards-heading">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
        backgroundSize: '48px 48px',
      }} />

      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        {/* Section header */}
        <motion.p
          {...fadeInUp}
          className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-coral-500 mb-4"
        >
          LATR Rewards
        </motion.p>

        <motion.h2
          {...fadeInUp}
          id="rewards-heading"
          className="text-center text-4xl sm:text-5xl md:text-[56px] font-bold text-navy leading-[1.08] tracking-tight mb-5"
        >
          Get rewarded for{' '}
          <span className="bg-gradient-to-r from-coral-500 to-coral-400 bg-clip-text text-transparent">
            paying rent.
          </span>
        </motion.h2>

        <motion.p
          {...fadeInUp}
          className="text-center text-lg md:text-xl text-gray-500 max-w-[600px] mx-auto mb-16 leading-relaxed"
        >
          Every repayment, round-up, and referral earns you points. Redeem for rent credits, travel, gift cards, and more — like a credit card rewards program, but for renters.
        </motion.p>

        {/* Feature cards */}
        <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              {...staggerItem}
              className="relative group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-coral-500" />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tier progression */}
        <motion.div {...fadeInUp} className="mb-16">
          <h3 className="text-center text-2xl sm:text-3xl font-bold text-navy mb-8">
            Three tiers. Pick the plan that fits you.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="relative bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all flex flex-col"
              >
                <div className="text-center mb-4">
                  <p className="font-bold text-navy text-lg">{tier.name}</p>
                  <p className="text-sm text-gray-500">{tier.price}</p>
                </div>

                <div className="bg-navy rounded-xl px-4 py-3 flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-300">Repayments</span>
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-white">{tier.multiplier}</span>
                    <span className="text-xs text-gray-400">pts/dollar</span>
                  </span>
                </div>

                <ul className="space-y-2 flex-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-3.5 h-3.5 text-coral-500 mt-0.5 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeInUp} className="text-center">
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2.5 h-13 px-10 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold rounded-full hover:from-coral-600 hover:to-coral-700 transition-all shadow-lg shadow-coral-500/20 hover:shadow-coral-500/30"
          >
            Start earning rewards
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-sm text-gray-400 mt-4">No credit card required. Earn from day one.</p>
        </motion.div>
      </div>
    </section>
  )
}
