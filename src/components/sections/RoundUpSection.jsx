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

        {/* Headline */}
        <motion.h2
          {...fadeInUp}
          id="roundup-heading"
          className="text-3xl sm:text-4xl md:text-[48px] font-bold text-white text-center leading-tight tracking-tight mb-4"
        >
          Every purchase helps<br />pay off your deposit
        </motion.h2>

        <motion.p
          {...fadeInUp}
          className="text-lg md:text-xl text-white/60 text-center mb-12 md:mb-16 max-w-[550px] mx-auto"
        >
          Round up your everyday spending and put the spare change toward your deposit. It adds up fast.
        </motion.p>

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
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3">
            <div className="w-2 h-2 rounded-full bg-coral-500 animate-pulse" />
            <span className="text-white/80 text-sm md:text-base font-medium">
              The average user saves <span className="text-coral-400 font-bold">$52/month</span> with Round-Up
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeInUp} className="flex justify-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 h-12 px-8 bg-coral-500 text-white font-semibold rounded-full hover:bg-coral-600 transition-colors shadow-lg shadow-coral-500/25"
          >
            Start rounding up
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
