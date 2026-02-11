import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import PhoneMockup from '../ui/PhoneMockup'
import ProgressStepper from '../ui/ProgressStepper'

const formFields = [
  { label: 'Full Name', value: 'Sarah Mitchell', focused: true },
  { label: 'Email', value: 'sarah@email.com' },
  { label: 'Phone', value: '+61 412 345 678' },
  { label: 'Current Address', value: '15 Oxford St, Bondi' },
]

const upcomingSections = [
  { num: 3, label: 'Rental History' },
  { num: 4, label: 'Employment' },
  { num: 5, label: 'References' },
]

function ApplicationFormScreen() {
  return (
    <div className="bg-white h-full flex flex-col">
      {/* Progress bar */}
      <div className="flex gap-1.5 px-1 pt-1 mb-2">
        <div className="flex-1 h-1 rounded-full bg-coral-500" />
        <div className="flex-1 h-1 rounded-full bg-coral-500" />
        <div className="flex-1 h-1 rounded-full bg-gray-200" />
        <div className="flex-1 h-1 rounded-full bg-gray-200" />
        <div className="flex-1 h-1 rounded-full bg-gray-200" />
      </div>

      <div className="px-1 mb-1">
        <p className="text-[10px] text-gray-400">Step 2 of 5</p>
        <h3 className="text-lg font-bold text-navy leading-tight">Smart Application</h3>
      </div>

      {/* Personal Info */}
      <div className="flex-1 overflow-hidden px-1">
        <p className="text-[10px] font-bold text-coral-500 uppercase tracking-widest mb-2 mt-2">Personal Info</p>

        <div className="space-y-3">
          {formFields.map((field) => (
            <div key={field.label}>
              <label className="text-[10px] text-gray-500 mb-0.5 block">{field.label}</label>
              <div
                className={`h-9 px-3 rounded-lg flex items-center text-xs font-medium text-navy ${
                  field.focused
                    ? 'border-2 border-coral-500 bg-white'
                    : 'border border-gray-200 bg-gray-50'
                }`}
              >
                {field.value}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Sections */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2">Upcoming Sections</p>
        <div className="space-y-1">
          {upcomingSections.map((s) => (
            <div key={s.num} className="flex items-center gap-2 py-1.5">
              <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center">
                <span className="text-[10px] text-gray-400 font-medium">{s.num}</span>
              </div>
              <span className="text-xs text-gray-400 flex-1">{s.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SmartApplySection() {
  return (
    <section className="relative bg-gradient-to-b from-coral-500 to-coral-600/90 py-20 md:py-28 overflow-hidden" aria-labelledby="smart-apply-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute bottom-32 left-[-5%] w-[250px] h-[250px] rounded-full bg-white/[0.03] blur-2xl pointer-events-none animate-float" />
      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        <ProgressStepper activeStep={3} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text Content */}
          <motion.div {...fadeInUp} className="text-center md:text-left order-2 md:order-1">
            <h2
              id="smart-apply-heading"
              className="text-3xl sm:text-4xl md:text-[40px] font-bold text-white leading-tight mb-4"
            >
              One-click<br />applications
            </h2>
            <p className="text-lg md:text-xl text-white/80 font-normal max-w-[450px] mb-10">
              Apply to any property in seconds. Your verified profile does the heavy lifting.
            </p>
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
              <ApplicationFormScreen />
            </PhoneMockup>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
