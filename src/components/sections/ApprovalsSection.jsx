import { motion } from 'framer-motion'
import { ChevronLeft, Check } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import PhoneMockup from '../ui/PhoneMockup'
import ProgressStepper from '../ui/ProgressStepper'

const plans = [
  { weeks: 52, rate: '$76.92/week', badge: 'Lowest', badgeColor: 'bg-navy text-white' },
  { weeks: 36, rate: '$111.11/week', badge: 'Recommended', badgeColor: 'bg-coral-500 text-white', selected: true },
  { weeks: 26, rate: '$153.85/week', badge: 'Fastest', badgeColor: 'bg-emerald-500 text-white' },
]

function DepositAidScreen() {
  return (
    <div className="bg-white h-full flex flex-col">
      {/* Back */}
      <div className="flex items-center gap-1 px-1 pt-2 pb-2">
        <ChevronLeft className="w-4 h-4 text-coral-500" />
        <span className="text-xs font-medium text-coral-500">Back</span>
      </div>

      {/* Approval Card */}
      <div className="mx-1 bg-coral-50 rounded-2xl p-5 flex flex-col items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-coral-100 flex items-center justify-center mb-2">
          <Check className="w-5 h-5 text-coral-500" />
        </div>
        <p className="text-xs font-medium text-coral-500 mb-1">Deposit Aid: Approved!</p>
        <p className="text-3xl font-extrabold text-navy">$4,000</p>
        <p className="text-xs text-gray-400 mt-0.5">Funded</p>
      </div>

      {/* Repayment Plans */}
      <div className="px-1 flex-1">
        <p className="text-sm font-bold text-navy mb-3">Choose your repayment plan</p>
        <div className="space-y-2.5">
          {plans.map((plan) => (
            <div
              key={plan.weeks}
              className={`rounded-xl px-4 py-3 flex items-center gap-3 ${
                plan.selected
                  ? 'border-2 border-coral-500 bg-coral-50/50'
                  : 'border border-gray-200 bg-white'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-navy">{plan.weeks} weeks</span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500">{plan.rate} &middot; 0% interest</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                plan.selected ? 'border-coral-500' : 'border-gray-300'
              }`}>
                {plan.selected && <div className="w-2.5 h-2.5 rounded-full bg-coral-500" />}
              </div>
            </div>
          ))}
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
        <ProgressStepper activeStep={4} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-end"
          >
            <PhoneMockup variant="floating" size="lg">
              <DepositAidScreen />
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
