import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Gift, Check, CreditCard, TrendingUp, Users, MapPin } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 2000
          const startTime = performance.now()
          function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString('en-AU')}</span>
}

const earningWays = [
  { icon: CreditCard, title: 'Repayments', desc: '1-5x points per dollar on every on-time repayment', gradient: 'from-coral-500 to-orange-500' },
  { icon: TrendingUp, title: 'Round-ups', desc: 'Bonus points on every spare change round-up', gradient: 'from-amber-500 to-yellow-500' },
  { icon: Users, title: 'Referrals', desc: 'Earn up to 1,000 points per successful referral', gradient: 'from-blue-500 to-cyan-500' },
  { icon: MapPin, title: 'Partners', desc: 'Automatic rewards at 40+ local neighbourhood businesses', gradient: 'from-emerald-500 to-teal-500' },
]

const tiers = [
  {
    name: 'Silver',
    price: 'Free',
    multiplier: '1x',
    benefits: ['Gift card & rent credit redemptions', 'Monthly Rent Day participation', 'Neighbourhood partner rewards'],
    border: 'border-white/[0.08]',
    glow: '',
    badge: 'bg-gray-500/20 text-gray-300',
  },
  {
    name: 'Gold',
    price: '$120/yr',
    multiplier: '2x',
    benefits: ['Priority Rent Day offers & 2x multiplier', 'Fitness class credits', 'Qantas & Velocity transfers'],
    border: 'border-amber-500/30',
    glow: 'shadow-lg shadow-amber-500/[0.08]',
    badge: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300',
    popular: true,
  },
  {
    name: 'Platinum',
    price: '$700/yr',
    multiplier: '5x',
    benefits: ['Premium travel transfer rates', 'Concierge support', 'Free monthly rent raffle entry', 'Exclusive partner offers'],
    border: 'border-coral-500/30',
    glow: 'shadow-lg shadow-coral-500/[0.08]',
    badge: 'bg-gradient-to-r from-coral-500/20 to-pink-500/20 text-coral-300',
  },
]

const redemptions = ['Rent Credits', 'Qantas Points', 'Velocity Points', 'Gift Cards', 'Dining Credits', 'Fitness Classes', 'Travel']

export default function RewardsSection() {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B0517 0%, #150A2E 50%, #0B0517 100%)' }}
      aria-labelledby="rewards-heading"
    >
      {/* Ambient glow effects */}
      <div className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-coral-500/[0.06] blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-[30%] w-[600px] h-[600px] rounded-full bg-blue-500/[0.04] blur-[140px] pointer-events-none" />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        {/* Hero — two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 md:mb-28">
          {/* Left: Copy */}
          <div>
            <motion.h2
              {...fadeInUp}
              id="rewards-heading"
              className="text-4xl sm:text-5xl md:text-[56px] font-bold text-white leading-[1.08] tracking-tight mb-5"
            >
              Get rewarded for{' '}
              <span className="bg-gradient-to-r from-coral-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                paying rent.
              </span>
            </motion.h2>

            <motion.p
              {...fadeInUp}
              className="text-lg md:text-xl text-white/50 mb-8 max-w-[480px] leading-relaxed"
            >
              Every repayment, round-up, and referral earns you points. Redeem for rent credits, travel, gift cards, and more — like a credit card rewards program, but for renters.
            </motion.p>

            {/* Stats row */}
            <motion.div {...fadeInUp} className="flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-white">5x</p>
                <p className="text-xs text-white/40">Max multiplier</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-white">40+</p>
                <p className="text-xs text-white/40">Local partners</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-white">$0</p>
                <p className="text-xs text-white/40">To get started</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Animated rewards card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Glow rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-coral-500/10 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[460px] md:h-[460px] rounded-full border border-purple-500/[0.06] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] md:w-[320px] md:h-[320px] rounded-full bg-coral-500/10 blur-[80px] pointer-events-none" />

              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <div className="w-[280px] md:w-[320px] rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.12] p-6 shadow-2xl">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral-500 to-pink-500 flex items-center justify-center">
                        <Gift className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-white/80">LATR Rewards</span>
                    </div>
                    <div className="h-6 px-2.5 rounded-full bg-amber-500/20 flex items-center">
                      <span className="text-[10px] font-bold text-amber-300">GOLD</span>
                    </div>
                  </div>

                  {/* Points counter */}
                  <div className="mb-6">
                    <p className="text-xs text-white/40 mb-1">Available Points</p>
                    <p className="text-4xl font-bold text-white tracking-tight">
                      <AnimatedCounter target={24750} />
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-[10px] text-white/40 mb-1.5">
                      <span>Gold tier</span>
                      <span>2x multiplier</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: '72%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="space-y-2">
                    {[
                      { label: 'Repayment bonus', pts: '+250', icon: CreditCard },
                      { label: 'Round-up', pts: '+12', icon: TrendingUp },
                      { label: 'Neighbourhood visit', pts: '+50', icon: MapPin },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-3 h-3 text-white/30" />
                          <span className="text-xs text-white/50">{item.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-emerald-400">{item.pts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating bonus badges */}
              <motion.div
                animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-3 -right-4 md:-right-8 z-20 bg-emerald-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                +50 pts
              </motion.div>

              <motion.div
                animate={{ y: [0, 5, 0], x: [0, -4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-2 -left-4 md:-left-8 z-20 bg-coral-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-coral-500/20"
              >
                2x multiplier
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Four ways to earn */}
        <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 md:mb-28">
          {earningWays.map((way) => (
            <motion.div
              key={way.title}
              {...staggerItem}
              className="group relative rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 hover:bg-white/[0.07] hover:border-white/[0.15] transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${way.gradient} flex items-center justify-center mb-3 opacity-80 group-hover:opacity-100 transition-opacity`}>
                <way.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{way.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{way.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Redemption tags */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/30 mb-4">Redeem for</p>
          <div className="flex flex-wrap justify-center gap-2">
            {redemptions.map((item) => (
              <span
                key={item}
                className="h-9 px-4 rounded-full bg-white/[0.06] border border-white/[0.08] text-sm text-white/60 flex items-center hover:bg-white/[0.1] hover:text-white/80 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Tier cards */}
        <motion.div {...fadeInUp} className="mb-16">
          <h3 className="text-center text-2xl sm:text-3xl font-bold text-white mb-3">
            Three tiers. Pick the plan that fits you.
          </h3>
          <p className="text-center text-white/40 mb-8">Silver is free for everyone. Upgrade to earn faster.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl bg-white/[0.04] border ${tier.border} p-5 hover:bg-white/[0.06] transition-all flex flex-col ${tier.glow}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 px-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className={`inline-flex h-7 px-3 rounded-full ${tier.badge} items-center mb-2`}>
                    <span className="text-xs font-bold">{tier.name}</span>
                  </div>
                  <p className="text-sm text-white/50">{tier.price}</p>
                </div>

                <div className="bg-white/[0.06] rounded-xl px-4 py-3 flex items-center justify-between mb-4">
                  <span className="text-sm text-white/40">Repayments</span>
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-white">{tier.multiplier}</span>
                    <span className="text-xs text-white/30">pts/dollar</span>
                  </span>
                </div>

                <ul className="space-y-2 flex-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                      <Check className="w-3.5 h-3.5 text-coral-400 mt-0.5 shrink-0" />
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
            className="group inline-flex items-center gap-2.5 h-13 px-10 bg-gradient-to-r from-coral-500 to-pink-500 text-white font-semibold rounded-full hover:from-coral-600 hover:to-pink-600 transition-all shadow-lg shadow-coral-500/25 hover:shadow-coral-500/40"
          >
            Start earning rewards
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-sm text-white/30 mt-4">No credit card required. Earn from day one.</p>
        </motion.div>
      </div>
    </section>
  )
}
