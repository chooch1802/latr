import { motion } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/animations'
import { sampleProperties } from '../../utils/constants'
import ProgressStepper from '../ui/ProgressStepper'

function PropertyCard({ property, index }) {
  const isSummary = property.type === 'summary'
  const isLast = index === sampleProperties.length - 1

  return (
    <motion.div
      {...staggerItem}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)' }}
      className="glass rounded-2xl p-6 transition-all duration-300 cursor-pointer"
      style={isLast ? { maskImage: 'linear-gradient(to bottom, black 40%, transparent)' } : undefined}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          {isSummary ? (
            <Globe className="w-5 h-5 text-white" />
          ) : (
            <span className="text-lg">🇦🇺</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-base font-medium truncate">{property.title}</span>
            {isSummary && <ChevronDown className="w-4 h-4 text-white/60" />}
          </div>
        </div>
        <div className="text-right">
          <span className={`text-white font-extrabold ${isSummary ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
            ${property.amount.toLocaleString()}
          </span>
          <span className="text-white/60 text-sm font-normal">/{property.period}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function AllPropertiesSection() {
  return (
    <section
      className="relative bg-gradient-to-b from-coral-500 to-coral-500/95 py-20 md:py-28"
      aria-labelledby="properties-heading"
    >
      {/* Decorative top fade from white */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none" />

      <div className="max-w-[500px] mx-auto px-6 relative z-10 pt-8">
        <ProgressStepper activeStep={1} labels={{ 1: 'Account' }} />

        <motion.h2
          {...fadeInUp}
          id="properties-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-10 md:mb-12"
        >
          All Properties
        </motion.h2>

        <motion.div {...staggerContainer} className="space-y-4">
          {sampleProperties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
