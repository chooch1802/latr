import { motion } from 'framer-motion'
import { TrendingUp, Shield, Zap } from 'lucide-react'

const benefits = [
  {
    icon: TrendingUp,
    label: 'Cash Flow First',
    sublabel: 'Income based approval',
  },
  {
    icon: Shield,
    label: 'Soft Credit Check',
    sublabel: 'No impact on your score',
  },
  {
    icon: Zap,
    label: '60 Second Approval',
    sublabel: 'Instant decision',
  },
]

export default function TrustBanner() {
  return (
    <motion.section
      aria-label="Trust and approval information"
      className="w-full py-8 px-6 md:py-10 lg:px-20"
      style={{ background: 'linear-gradient(90deg, #FF5A3D 0%, #FF8A65 100%)' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h2 className="text-xl md:text-2xl lg:text-[28px] font-bold text-white text-center tracking-[-0.01em] mb-8 lg:mb-8">
        Approved based on income, not credit history
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-16">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.label}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            >
              <benefit.icon
                className="w-7 h-7 md:w-8 md:h-8 text-white mb-3"
                strokeWidth={2}
                aria-hidden="true"
              />
            </motion.div>
            <h3 className="text-base md:text-[15px] lg:text-base font-semibold text-white mb-0.5">
              {benefit.label}
            </h3>
            <p className="text-sm text-white/80">
              {benefit.sublabel}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
