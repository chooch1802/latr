import { motion } from 'framer-motion'
import { FileText, CheckCircle, Upload, Clock } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import ProgressStepper from '../ui/ProgressStepper'

const steps = [
  { icon: FileText, label: 'Pre-filled form', desc: 'Your details, ready to go' },
  { icon: Upload, label: 'Upload docs', desc: 'ID, payslips, references' },
  { icon: Clock, label: 'Track status', desc: 'Real-time updates' },
  { icon: CheckCircle, label: 'Get approved', desc: 'Instant notifications' },
]

export default function SmartApplySection() {
  return (
    <section className="relative bg-gradient-to-b from-coral-500 to-coral-600/90 py-20 md:py-28 overflow-hidden" aria-labelledby="smart-apply-heading">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute bottom-32 left-[-5%] w-[250px] h-[250px] rounded-full bg-white/[0.03] blur-2xl pointer-events-none animate-float" />
      <div className="max-w-[1280px] mx-auto px-6 md:px-20 relative z-10">
        <ProgressStepper activeStep={3} labels={{ 3: 'Send' }} />

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

          {/* Application Steps Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="order-1 md:order-2"
          >
            <div className="glass rounded-3xl p-8 max-w-[400px] mx-auto">
              <div className="text-white/60 text-sm font-medium uppercase tracking-widest mb-6">
                Application Steps
              </div>
              <div className="space-y-5">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/10">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-base">{step.label}</p>
                      <p className="text-white/60 text-sm">{step.desc}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 rounded-full bg-white/30" />
                      </div>
                    )}
                    {index === steps.length - 1 && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-8 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                  className="h-full bg-white/50 rounded-full"
                />
              </div>
              <p className="text-white/40 text-xs mt-2">Application sent in under 60 seconds</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
