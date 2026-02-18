import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Coins, ShieldCheck } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'
import { useEffect, useRef } from 'react'

function AnimatedCounter({ target, prefix = '$', duration = 2 }) {
  const ref = useRef(null)
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (v) => `${prefix}${Math.round(v).toLocaleString()}`)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const unsub = rounded.on('change', (v) => { node.textContent = v })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(motionVal, target, { duration, ease: 'easeOut' })
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(node)
    return () => { unsub(); observer.disconnect() }
  }, [motionVal, rounded, target, duration])

  return <span ref={ref}>{prefix}0</span>
}

const metrics = [
  { label: 'Avg. monthly savings', value: 52, prefix: '$', icon: Coins },
  { label: 'Avg. yearly impact', value: 624, prefix: '$', icon: TrendingUp },
  { label: 'Zero impact to credit', value: null, icon: ShieldCheck },
]

export default function RoundUpSection() {
  return (
    <section
      className="relative bg-[#060D1B] py-24 md:py-32 overflow-hidden"
      aria-labelledby="roundup-heading"
    >
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-coral-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-[-15%] w-[500px] h-[500px] rounded-full bg-coral-500/[0.06] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[100px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        {/* Badge */}
        <motion.div {...fadeInUp} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 bg-coral-500/10 border border-coral-500/20 text-coral-400 text-xs font-semibold uppercase tracking-[0.2em] px-5 py-2.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-pulse" />
            Round-Up
          </span>
        </motion.div>

        {/* Two-column hero: copy left, mockup right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 md:mb-28">
          {/* Left */}
          <div>
            <motion.h2
              {...fadeInUp}
              id="roundup-heading"
              className="text-4xl sm:text-5xl md:text-[56px] font-bold text-white leading-[1.08] tracking-tight mb-5"
            >
              Every cent counts.{' '}
              <span className="bg-gradient-to-r from-coral-400 to-coral-500 bg-clip-text text-transparent">
                Make them work.
              </span>
            </motion.h2>

            <motion.p
              {...fadeInUp}
              className="text-lg md:text-xl text-white/50 mb-10 max-w-[480px] leading-relaxed"
            >
              Round-Up turns your everyday spending into automatic deposit repayments. Set it once, and every purchase chips away at your bond.
            </motion.p>

            {/* Feature pills */}
            <motion.div {...fadeInUp} className="space-y-3 mb-10">
              {[
                { text: 'Choose your rounding', detail: '$1, $2 or $5 — you decide how much spare change goes toward your deposit' },
                { text: 'Fully automatic', detail: 'Once enabled, every transaction is rounded up without lifting a finger' },
                { text: 'Set a weekly cap', detail: 'Stay in control with a spending limit that suits your budget' },
              ].map((item) => (
                <div key={item.text} className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-coral-500/20 transition-all duration-300">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-coral-500/20 to-coral-500/5 flex items-center justify-center mt-0.5 shrink-0 border border-coral-500/10">
                    <div className="w-2 h-2 rounded-full bg-coral-500 group-hover:scale-125 transition-transform" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">{item.text}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div {...fadeInUp} className="flex items-center gap-4">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2.5 h-13 px-8 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold rounded-full hover:from-coral-600 hover:to-coral-700 transition-all shadow-lg shadow-coral-500/20 hover:shadow-coral-500/30"
              >
                Start rounding up
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <span className="text-white/30 text-sm">No credit impact</span>
            </motion.div>
          </div>

          {/* Right: iPhone mockup with premium presentation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Layered glow rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full border border-coral-500/10 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[440px] md:h-[440px] rounded-full border border-coral-500/[0.05] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full bg-coral-500/10 blur-[80px] pointer-events-none" />
              <motion.img
                src="/images/roundup-mockup.svg"
                alt="LATR Round-Up feature showing $545 in total round-ups with recent transactions"
                className="relative z-10 w-[280px] md:w-[340px]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Metrics bar */}
        <motion.div
          {...fadeInUp}
          className="grid grid-cols-1 sm:grid-cols-3 gap-px mb-20 md:mb-28 rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03]"
        >
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center gap-4 px-6 py-6 md:py-8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500/15 to-transparent flex items-center justify-center shrink-0 border border-coral-500/10">
                <m.icon className="w-5 h-5 text-coral-400" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {m.value !== null ? <AnimatedCounter target={m.value} prefix={m.prefix} /> : <span className="text-xl md:text-2xl">Soft check only</span>}
                </p>
                <p className="text-white/40 text-sm">{m.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* How it works — premium stepped layout */}
        <div className="mb-20 md:mb-28">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-white tracking-tight mb-3">
              How it works
            </h3>
            <p className="text-white/40 text-lg">Three steps. Completely automatic.</p>
          </motion.div>

          <motion.div {...staggerContainer} className="max-w-[800px] mx-auto">
            {[
              { num: '01', title: 'Buy something', desc: 'Use your linked bank account for any everyday purchase.', accent: 'from-coral-500/20 to-coral-500/5' },
              { num: '02', title: 'We round it up', desc: 'To the nearest $1, $2 or $5 — you choose the amount.', accent: 'from-coral-500/30 to-coral-500/10' },
              { num: '03', title: 'Deposit gets paid', desc: 'The spare change goes straight toward your deposit repayments.', accent: 'from-coral-500/40 to-coral-500/15' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                {...staggerItem}
                className="relative flex items-stretch"
              >
                {/* Timeline line */}
                {i < 2 && (
                  <div className="absolute left-[27px] top-[56px] bottom-0 w-px bg-gradient-to-b from-coral-500/30 to-transparent" />
                )}

                {/* Number circle */}
                <div className="relative z-10 shrink-0 mr-6">
                  <div className={`w-[55px] h-[55px] rounded-2xl bg-gradient-to-br ${step.accent} border border-coral-500/20 flex items-center justify-center`}>
                    <span className="text-coral-400 text-sm font-bold tracking-wider">{step.num}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-10">
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-coral-500/15 transition-all duration-300">
                    <h4 className="text-white font-semibold text-lg mb-1">{step.title}</h4>
                    <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Live transaction feed — glass card */}
        <motion.div
          {...fadeInUp}
          className="max-w-[700px] mx-auto mb-16"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white/60 text-sm font-medium tracking-wide">Live round-up preview</span>
              </div>
              <span className="text-white/30 text-xs font-mono">Today</span>
            </div>

            {[
              { merchant: 'Woolworths', category: 'Groceries', original: '$47.85', rounded: '$50.00', saved: '+$2.15' },
              { merchant: '7-Eleven', category: 'Fuel', original: '$63.60', rounded: '$65.00', saved: '+$1.40' },
              { merchant: 'The Coffee Club', category: 'Cafe', original: '$4.60', rounded: '$5.00', saved: '+$0.40' },
            ].map((tx, i) => (
              <motion.div
                key={tx.merchant}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs font-bold">+</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{tx.merchant}</p>
                    <p className="text-white/30 text-xs">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-sm font-semibold">{tx.saved}</p>
                  <p className="text-white/25 text-xs font-mono">{tx.original} → {tx.rounded}</p>
                </div>
              </motion.div>
            ))}

            <div className="px-6 py-4 bg-gradient-to-r from-coral-500/10 to-transparent border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Today&apos;s round-ups</span>
                <span className="text-coral-400 font-bold text-lg">+$3.95</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div {...fadeInUp} className="text-center">
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2.5 h-13 px-10 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold rounded-full hover:from-coral-600 hover:to-coral-700 transition-all shadow-lg shadow-coral-500/20 hover:shadow-coral-500/30 mb-4"
          >
            Get started with Round-Up
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="text-white/30 text-sm">Free to enable. Cancel anytime.</p>
        </motion.div>
      </div>
    </section>
  )
}
