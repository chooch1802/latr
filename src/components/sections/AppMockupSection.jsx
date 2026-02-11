import { motion } from 'framer-motion'
import { ChevronLeft, Heart, MoreVertical, MapPin, Bed, Bath, Car, Ruler } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import PhoneMockup from '../ui/PhoneMockup'
import ProgressStepper from '../ui/ProgressStepper'

const features = ['Air Conditioning', 'Balcony', 'Built-in Wardrobe', 'Dishwasher', 'Gym', 'Pool']

function PropertyDetailScreen() {
  return (
    <div className="bg-navy h-full flex flex-col">
      {/* Nav bar */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <MoreVertical className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Image placeholder */}
      <div className="relative mx-2 h-32 bg-white/10 rounded-2xl flex items-end justify-between px-3 pb-3">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white/40" />
          <div className="w-2 h-2 rounded-full bg-white/40" />
          <div className="w-2 h-2 rounded-full bg-white/40" />
        </div>
        <div className="bg-coral-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
          LATR
        </div>
      </div>

      {/* Property details card */}
      <div className="flex-1 bg-white rounded-t-3xl mt-3 px-4 pt-4 pb-2 overflow-hidden">
        {/* Title + Price */}
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-navy leading-tight">
              Modern 2BR Apartment — Sydney CBD
            </h4>
          </div>
          <div className="text-right shrink-0">
            <span className="text-lg font-extrabold text-coral-500">$3,414</span>
            <span className="text-[10px] text-gray-400 block">/month</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-1 mb-4">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-[10px] text-gray-500">42 Pitt St, Sydney NSW 2000</span>
        </div>

        {/* Stats */}
        <div className="flex justify-between mb-4 border-t border-gray-100 pt-3">
          <Stat icon="🛏️" value="2" label="Beds" />
          <Stat icon="🛁" value="2" label="Bath" />
          <Stat icon="🅿️" value="1" label="Park" />
          <Stat icon="📐" value="85" label="m²" />
        </div>

        {/* Features */}
        <div>
          <p className="text-xs font-bold text-navy mb-2">Features</p>
          <div className="flex flex-wrap gap-1.5">
            {features.map((f) => (
              <span
                key={f}
                className="text-[10px] font-medium text-coral-500 bg-coral-50 px-2.5 py-1 rounded-full"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-sm">{icon}</span>
      <span className="text-sm font-bold text-navy">{value}</span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  )
}

export default function AppMockupSection() {
  return (
    <section className="relative bg-coral-500 py-20 md:py-28 overflow-hidden" aria-labelledby="app-mockup-heading">
      {/* Decorative floating shape */}
      <div className="absolute top-20 right-[-5%] w-[300px] h-[300px] rounded-full bg-white/[0.03] blur-2xl pointer-events-none animate-float-slow" />
      {/* Section divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        <ProgressStepper activeStep={2} />

        <div className="flex flex-col items-center">
          <PhoneMockup variant="floating" size="lg">
            <PropertyDetailScreen />
          </PhoneMockup>

          <motion.div {...fadeInUp} className="text-center mt-12 md:mt-16">
            <h2
              id="app-mockup-heading"
              className="text-3xl sm:text-4xl md:text-[40px] font-bold text-white leading-tight mb-4"
            >
              Find and apply in a few taps
            </h2>
            <p className="text-lg md:text-xl text-white/80 font-normal max-w-[500px] mx-auto">
              Easily find properties and submit applications.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
