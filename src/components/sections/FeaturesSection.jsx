import { motion } from 'framer-motion'
import { Search, FileText, Key } from 'lucide-react'

const features = [
  {
    icon: Search,
    label: 'Find',
    color: 'bg-green-500',
    shadow: '0 4px 20px rgba(34,197,94,0.3)',
    ring: 'ring-green-200',
  },
  {
    icon: FileText,
    label: 'Apply',
    color: 'bg-blue-500',
    shadow: '0 4px 20px rgba(59,130,246,0.3)',
    ring: 'ring-blue-200',
  },
  {
    icon: Key,
    label: 'Move',
    color: 'bg-coral-500',
    shadow: '0 4px 20px rgba(255,90,61,0.3)',
    ring: 'ring-coral-200',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20 md:py-28" aria-labelledby="features-heading">
      <div className="max-w-[1280px] mx-auto px-6 md:px-20">
        <div className="grid grid-cols-3 gap-8 md:gap-16 max-w-[700px] mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: index * 0.12,
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className={`w-16 h-16 md:w-24 md:h-24 ${feature.color} rounded-full flex items-center justify-center mb-5 md:mb-8 cursor-pointer ring-4 ${feature.ring} ring-offset-2`}
                style={{ boxShadow: feature.shadow }}
              >
                <feature.icon className="w-7 h-7 md:w-10 md:h-10 text-white" strokeWidth={2} />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900"
              >
                {feature.label}
              </motion.h3>
            </motion.div>
          ))}
        </div>

        {/* Connecting line between icons (desktop only) */}
        <div className="hidden md:flex justify-center mt-[-60px] mb-[-20px]">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="w-[300px] h-[2px] bg-gradient-to-r from-green-300 via-blue-300 to-coral-300 origin-left"
            style={{ marginTop: '-80px' }}
          />
        </div>
      </div>
    </section>
  )
}
