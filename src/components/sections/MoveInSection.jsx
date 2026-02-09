import { motion } from 'framer-motion'
import { Home, Users, Zap, CreditCard, PartyPopper } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import ProgressStepper from '../ui/ProgressStepper'

const features = [
  { icon: Home, label: 'Track your rent', color: 'bg-coral-400/30' },
  { icon: Users, label: 'Split bills with roommates', color: 'bg-blue-400/30' },
  { icon: Zap, label: 'Manage utilities', color: 'bg-yellow-400/30' },
  { icon: CreditCard, label: 'Auto-pay everything', color: 'bg-green-400/30' },
]

export default function MoveInSection() {
  return (
    <section className="relative bg-gradient-to-b from-coral-500 to-coral-600 py-20 md:py-28 overflow-hidden" aria-labelledby="movein-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute top-20 left-[-5%] w-[280px] h-[280px] rounded-full bg-white/[0.04] blur-2xl pointer-events-none animate-float-slow" />
      {/* Bottom fade to white for calculator transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none z-20" />
      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        <ProgressStepper activeStep={5} labels={{ 5: 'Complete' }} />

        <div className="flex flex-col items-center text-center">
          {/* Celebration icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
            className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20"
          >
            <PartyPopper className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h2
            {...fadeInUp}
            id="movein-heading"
            className="text-3xl sm:text-4xl md:text-[48px] font-bold text-white leading-tight mb-4"
          >
            Move in &<br />manage everything
          </motion.h2>

          <motion.p
            {...fadeInUp}
            className="text-lg md:text-xl text-white/80 font-normal max-w-[500px] mb-12"
          >
            Your Household Hub keeps all your rental finances in one place.
          </motion.p>

          {/* Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-[700px]"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="glass rounded-2xl p-5 flex flex-col items-center gap-3 cursor-default"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-sm font-medium text-center leading-snug">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12 glass rounded-full px-8 py-3 inline-flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80 text-sm font-medium">You&apos;re all set. Welcome home.</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
