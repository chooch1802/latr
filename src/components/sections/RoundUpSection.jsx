import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'
import RoundUpMockup from '../mockups/RoundUpMockup'

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
            Round Up
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
              Round Up turns your everyday spending into automatic deposit repayments. Set it once, and every purchase chips away at your bond.
            </motion.p>

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
              <motion.div
                className="relative z-10"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <RoundUpMockup />
              </motion.div>
            </div>
          </motion.div>
        </div>

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

        {/* Bottom CTA */}
        <motion.div {...fadeInUp} className="text-center">
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2.5 h-13 px-10 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold rounded-full hover:from-coral-600 hover:to-coral-700 transition-all shadow-lg shadow-coral-500/20 hover:shadow-coral-500/30 mb-4"
          >
            Get started with Round Up
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
