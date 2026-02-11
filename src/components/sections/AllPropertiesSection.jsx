import { motion } from 'framer-motion'
import { Home, Building2, Building, Warehouse, CheckCircle } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import PhoneMockup from '../ui/PhoneMockup'
import ProgressStepper from '../ui/ProgressStepper'

const propertyTypes = [
  { icon: Home, label: 'House' },
  { icon: Building, label: 'Unit / Apartment' },
  { icon: Building2, label: 'Townhouse' },
  { icon: Warehouse, label: 'Warehouse', selected: true },
  { icon: Building, label: 'Office' },
]

function PropertyTypeScreen() {
  return (
    <div className="bg-gray-50 h-full flex flex-col">
      <div className="px-1 pt-2 pb-4">
        <p className="text-coral-500 text-xs font-semibold tracking-wide uppercase mb-1">Step 1 of 5</p>
        <h3 className="text-xl font-bold text-navy leading-tight">
          What are you<br />looking for?
        </h3>
      </div>

      <div className="flex-1 space-y-3 px-0.5">
        {propertyTypes.map((type) => (
          <div
            key={type.label}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
              type.selected
                ? 'bg-coral-500 shadow-md'
                : 'bg-white shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              type.selected ? 'bg-white/20' : 'bg-coral-50'
            }`}>
              <type.icon className={`w-5 h-5 ${type.selected ? 'text-white' : 'text-coral-500'}`} />
            </div>
            <span className={`text-sm font-semibold flex-1 ${
              type.selected ? 'text-white' : 'text-navy'
            }`}>
              {type.label}
            </span>
            {type.selected && (
              <CheckCircle className="w-5 h-5 text-white/70" />
            )}
          </div>
        ))}
      </div>

      <div className="px-0.5 pb-4 mt-auto pt-3">
        <div className="w-full bg-coral-500 text-white text-center py-3.5 rounded-xl font-semibold text-sm">
          Continue
        </div>
      </div>
    </div>
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

      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10 pt-8">
        <ProgressStepper activeStep={1} />

        <div className="flex flex-col items-center">
          <PhoneMockup variant="floating" size="lg">
            <PropertyTypeScreen />
          </PhoneMockup>

          <motion.div {...fadeInUp} className="text-center mt-12 md:mt-16">
            <h2
              id="properties-heading"
              className="text-3xl sm:text-4xl md:text-[40px] font-bold text-white leading-tight mb-4"
            >
              Choose your property type
            </h2>
            <p className="text-lg md:text-xl text-white/80 font-normal max-w-[500px] mx-auto">
              Tell us what you're looking for and we'll find the perfect match.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
