import { motion } from 'framer-motion'
import { Home, Users, Zap, CreditCard, PartyPopper, Plus, Activity, User, Bell, ArrowRight, Calendar, CheckCircle } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import PhoneMockup from '../ui/PhoneMockup'
import ProgressStepper from '../ui/ProgressStepper'

const features = [
  { icon: Home, label: 'Track your rent', color: 'bg-coral-400/30' },
  { icon: Users, label: 'Split bills with roommates', color: 'bg-blue-400/30' },
  { icon: Zap, label: 'Manage utilities', color: 'bg-yellow-400/30' },
  { icon: CreditCard, label: 'Auto-pay everything', color: 'bg-green-400/30' },
]

function DashboardScreen() {
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
          All accounts <span className="text-[10px]">&#9660;</span>
        </div>
        <div className="text-white text-2xl font-extrabold mb-3">$4,224.47</div>
        <div className="flex gap-2">
          <div className="flex-1 bg-white/20 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1">
            <Plus className="w-3 h-3" /> Add money
          </div>
          <div className="flex-1 bg-white/20 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1">
            <ArrowRight className="w-3 h-3" /> Send
          </div>
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

export default function MoveInSection() {
  return (
    <section className="relative bg-gradient-to-b from-coral-500 to-coral-600 py-20 md:py-28 overflow-hidden" aria-labelledby="movein-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute top-20 left-[-5%] w-[280px] h-[280px] rounded-full bg-white/[0.04] blur-2xl pointer-events-none animate-float-slow" />
      {/* Bottom fade to white for calculator transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none z-20" />
      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        <ProgressStepper activeStep={5} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text Content */}
          <motion.div {...fadeInUp} className="text-center md:text-left order-2 md:order-1">
            {/* Celebration icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
              className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20 mx-auto md:mx-0"
            >
              <PartyPopper className="w-8 h-8 text-white" />
            </motion.div>

            <h2
              id="movein-heading"
              className="text-3xl sm:text-4xl md:text-[40px] font-bold text-white leading-tight mb-4"
            >
              Move in &<br />manage everything
            </h2>

            <p className="text-lg md:text-xl text-white/80 font-normal max-w-[450px] mb-8">
              Your Hub keeps all your rental finances in one place.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-[360px] mx-auto md:mx-0">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className="glass rounded-2xl p-4 flex flex-col items-center gap-2 cursor-default"
                >
                  <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium text-center leading-snug">{feature.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="order-1 md:order-2 flex justify-center"
          >
            <PhoneMockup variant="floating" size="lg">
              <DashboardScreen />
            </PhoneMockup>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
