import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Building2 } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import PhoneMockup from '../ui/PhoneMockup'
import ProgressStepper from '../ui/ProgressStepper'

function ReviewScreen() {
  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-2 py-3">
        <ArrowLeft className="w-5 h-5 text-gray-900" />
        <span className="text-base font-semibold text-gray-900">Review & Add money</span>
      </div>

      <div className="flex-1 px-3 space-y-6 mt-4">
        {/* Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Amount</span>
            <div className="w-5 h-5 rounded-full border-2 border-coral-500 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-coral-500" />
            </div>
          </div>
          <div className="text-4xl font-extrabold text-gray-900">$4,000</div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Method */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Method</p>
            <p className="text-sm font-semibold text-gray-900">Bank Transfer</p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Lock className="w-3.5 h-3.5" />
          <span>Secure payment</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-3 pb-6 mt-auto">
        <div className="w-full bg-coral-500 text-white text-center py-4 rounded-xl font-semibold text-base">
          Add money
        </div>
      </div>
    </div>
  )
}

export default function ApprovalsSection() {
  return (
    <section className="relative bg-gradient-to-b from-coral-600/90 to-coral-500 py-20 md:py-28 overflow-hidden" aria-labelledby="approvals-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute top-40 right-[-8%] w-[350px] h-[350px] rounded-full bg-white/[0.03] blur-2xl pointer-events-none animate-float-slower" />
      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        <ProgressStepper activeStep={4} labels={{ 4: 'Review' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-end"
          >
            <PhoneMockup variant="floating" size="md">
              <ReviewScreen />
            </PhoneMockup>
          </motion.div>

          {/* Text Content */}
          <motion.div {...fadeInUp} className="text-center md:text-left">
            <h2
              id="approvals-heading"
              className="text-3xl sm:text-4xl md:text-[40px] font-bold text-white leading-tight mb-4"
            >
              Fast and transparent<br />approvals
            </h2>
            <p className="text-lg md:text-xl text-white/80 font-normal max-w-[500px]">
              Quick approvals at your fingertips.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
