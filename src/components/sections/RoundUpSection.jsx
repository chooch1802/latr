import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'

const flowSteps = [
  {
    label: 'You spend',
    value: '$4.50',
    sub: 'Morning coffee',
    bg: 'bg-white/10',
    border: 'border-white/20',
  },
  {
    label: 'We round to',
    value: '$5.00',
    sub: 'Nearest dollar',
    bg: 'bg-white/15',
    border: 'border-white/25',
  },
  {
    label: 'Your deposit gets',
    value: '+$0.50',
    sub: 'Automatically',
    bg: 'bg-coral-500/80',
    border: 'border-coral-400/50',
    highlight: true,
  },
]

export default function RoundUpSection() {
  return (
    <section
      className="relative bg-gradient-to-b from-[#0B1A2B] to-[#0B1A2B]/95 py-20 md:py-28 overflow-hidden"
      aria-labelledby="roundup-heading"
    >
      {/* Decorative blurs */}
      <div className="absolute top-20 right-[-10%] w-[300px] h-[300px] rounded-full bg-coral-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[-5%] w-[200px] h-[200px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        {/* Badge */}
        <motion.div {...fadeInUp} className="flex justify-center mb-6">
          <span className="inline-block border-2 border-coral-500 text-coral-500 text-sm font-semibold uppercase tracking-widest px-5 py-2 rounded-full">
            Round-Up
          </span>
        </motion.div>

        {/* Two-column: copy left, mockup right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12 md:mb-16">
          {/* Left: headline + description */}
          <div>
            <motion.h2
              {...fadeInUp}
              id="roundup-heading"
              className="text-3xl sm:text-4xl md:text-[48px] font-bold text-white leading-tight tracking-tight mb-4"
            >
              Hit your goals with Round-Up
            </motion.h2>

            <motion.p
              {...fadeInUp}
              className="text-lg md:text-xl text-white/60 mb-8 max-w-[480px]"
            >
              Whether you&apos;re paying off your deposit faster or building a savings buffer, use Round-Up to reach your goals without even thinking about it.
            </motion.p>

            <motion.div {...fadeInUp} className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-coral-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-coral-500" />
                </div>
                <p className="text-white/70 text-sm md:text-base">
                  Automatically rounds up your everyday transactions to the nearest <span className="text-white font-semibold">$1, $2 or $5</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-coral-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-coral-500" />
                </div>
                <p className="text-white/70 text-sm md:text-base">
                  Spare change goes straight toward your <span className="text-white font-semibold">deposit repayments</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-coral-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-coral-500" />
                </div>
                <p className="text-white/70 text-sm md:text-base">
                  Set a <span className="text-white font-semibold">weekly cap</span> so you&apos;re always in control
                </p>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div {...fadeInUp}>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 h-12 px-8 bg-coral-500 text-white font-semibold rounded-full hover:bg-coral-600 transition-colors shadow-lg shadow-coral-500/25"
              >
                Start rounding up
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right: iPhone mockup */}
          <motion.div
            {...fadeInUp}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Coral glow circle behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full bg-coral-500/15 blur-2xl pointer-events-none" />
              <img
                src="/images/roundup-mockup.svg"
                alt="LATR Round-Up feature showing $545 in total round-ups with recent transactions from Woolworths, 7-Eleven, and The Coffee Club"
                className="relative z-10 w-[300px] md:w-[380px] drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>

        {/* How Round-Up Works — stepped explainer */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-start mb-16 md:mb-20">
          {/* Left: heading */}
          <motion.div {...fadeInUp}>
            <h3 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-white leading-tight tracking-tight mb-3">
              How Round-Up works
            </h3>
            <p className="text-white/50 text-base">Small decisions add up quick.</p>
          </motion.div>

          {/* Right: 3 steps with staggered colored bars */}
          <motion.div {...staggerContainer} className="space-y-4">
            {[
              { num: '01', text: 'Buy something.', bg: 'bg-coral-500/20', circle: 'bg-coral-500/30 text-coral-300' },
              { num: '02', text: 'We round it up to the nearest $1, $2 or $5 — you choose.', bg: 'bg-coral-500/30', circle: 'bg-coral-500/40 text-coral-200' },
              { num: '03', text: 'The difference goes straight toward your deposit repayments.', bg: 'bg-coral-500/40', circle: 'bg-coral-500/50 text-white' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                {...staggerItem}
                className={`flex items-center gap-5 rounded-2xl px-6 py-5 ${step.bg}`}
                style={{ marginLeft: `${i * 40}px` }}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${step.circle}`}>
                  {step.num}
                </div>
                <p className="text-white text-base md:text-lg font-medium">{step.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3-card visual flow */}
        <motion.div
          {...staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-[900px] mx-auto mb-12"
        >
          {flowSteps.map((step, i) => (
            <motion.div
              key={i}
              {...staggerItem}
              className={`relative rounded-2xl border p-6 md:p-8 text-center ${step.bg} ${step.border} backdrop-blur-sm`}
            >
              <p className="text-white/60 text-sm font-medium mb-2">{step.label}</p>
              <p className={`text-3xl md:text-4xl font-extrabold mb-1 ${step.highlight ? 'text-coral-400' : 'text-white'}`}>
                {step.value}
              </p>
              <p className="text-white/40 text-sm">{step.sub}</p>

              {/* Arrow between cards (desktop only) */}
              {i < flowSteps.length - 1 && (
                <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white/60" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Impact stat */}
        <motion.div
          {...fadeInUp}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3">
            <div className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
            <span className="text-white/80 text-sm md:text-base font-medium">
              The average user saves <span className="text-coral-400 font-bold">$52/month</span> with Round-Up
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
