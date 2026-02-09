import { motion } from 'framer-motion'
import { Plus, Home, Activity, User, Bell, ArrowRight, Calendar, CheckCircle, Zap } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import PhoneMockup from '../ui/PhoneMockup'
import ProgressStepper from '../ui/ProgressStepper'

function AppScreen() {
  return (
    <div className="bg-gray-50 h-full">
      {/* App Header */}
      <div className="flex items-center justify-between px-2 py-3">
        <span className="text-lg font-bold text-gray-900">LATR</span>
        <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center">
          <User className="w-4 h-4 text-coral-500" />
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-coral-500 to-coral-400 rounded-2xl p-4 mx-1 mb-4">
        <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
          All accounts <span className="text-[10px]">▼</span>
        </div>
        <div className="text-white text-2xl font-extrabold mb-3">$4,224.47</div>
        <div className="flex gap-2">
          <button className="flex-1 bg-white/20 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1">
            <Plus className="w-3 h-3" /> Add money
          </button>
          <button className="flex-1 bg-white/20 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1">
            <ArrowRight className="w-3 h-3" /> Send
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-900">Transactions</span>
          <span className="text-xs font-medium text-coral-500">See all</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Rent Due in 5 Days</p>
              <p className="text-[10px] text-gray-400">Pending</p>
            </div>
            <span className="text-xs font-semibold text-red-500">-$1,250</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Deposit Approved</p>
              <p className="text-[10px] text-gray-400">Completed</p>
            </div>
            <span className="text-xs font-semibold text-green-600">+$4,000</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Bill Split: Electricity</p>
              <p className="text-[10px] text-gray-400">Completed</p>
            </div>
            <span className="text-xs font-semibold text-red-500">-$120</span>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t border-gray-200 bg-white">
        <Home className="w-5 h-5 text-coral-500" />
        <Activity className="w-5 h-5 text-gray-400" />
        <User className="w-5 h-5 text-gray-400" />
        <Bell className="w-5 h-5 text-gray-400" />
      </div>

      {/* FAB */}
      <div className="absolute bottom-16 right-4 w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center shadow-large">
        <Plus className="w-6 h-6 text-white" />
      </div>
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
        <ProgressStepper activeStep={2} labels={{ 2: 'Add' }} />

        <div className="flex flex-col items-center">
          <PhoneMockup variant="floating" size="md">
            <AppScreen />
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
