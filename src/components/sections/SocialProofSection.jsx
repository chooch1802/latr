import { motion } from 'framer-motion'
import { Apple, Play } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'
import Accordion from '../ui/Accordion'

const accordionItems = [
  {
    title: 'Get Started',
    content: (
      <div className="space-y-3 text-base">
        <p>Getting started with LATR is simple:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-500">
          <li>Download the app from App Store or Google Play</li>
          <li>Create your account with email or phone</li>
          <li>Verify your identity with a quick selfie</li>
          <li>Connect your bank account securely</li>
          <li>Start applying for properties instantly</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Sign up',
    content: (
      <p className="text-base text-gray-500">
        Create your free LATR account in under 2 minutes. All you need is an Australian mobile number and a valid ID.
      </p>
    ),
  },
  {
    title: 'Login',
    content: (
      <p className="text-base text-gray-500">
        Already have an account? Log in with your mobile number and a one-time SMS code — no password needed.
      </p>
    ),
  },
]

export default function SocialProofSection() {
  return (
    <section id="social-proof" className="bg-white py-20 md:py-30" aria-labelledby="social-proof-heading">
      <div className="max-w-[1280px] mx-auto px-6 md:px-20">
        <motion.h2
          {...fadeInUp}
          id="social-proof-heading"
          className="text-4xl sm:text-5xl md:text-[56px] font-extrabold text-coral-500 text-center leading-tight mb-6"
        >
          10,000+ renters,<br />plus you.
        </motion.h2>

        <motion.p
          {...fadeInUp}
          className="text-lg md:text-2xl text-gray-500 text-center mb-10 md:mb-12"
        >
          It only takes seconds to get started.
        </motion.p>

        {/* App Store Buttons */}
        <motion.div
          {...fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20"
        >
          <a
            href="/signup"
            className="flex items-center gap-3 bg-coral-500 rounded-xl px-6 h-14 text-white font-semibold text-sm hover:bg-coral-600 hover:scale-105 transition-all duration-200"
          >
            <Apple className="w-6 h-6" />
            <div className="text-left">
              <div className="text-[10px] font-normal text-white/70 leading-tight">Download on the</div>
              <div className="text-sm font-semibold leading-tight">App Store</div>
            </div>
          </a>
          <a
            href="/signup"
            className="flex items-center gap-3 bg-coral-500 rounded-xl px-6 h-14 text-white font-semibold text-sm hover:bg-coral-600 hover:scale-105 transition-all duration-200"
          >
            <Play className="w-6 h-6 fill-current" />
            <div className="text-left">
              <div className="text-[10px] font-normal text-white/70 leading-tight">Get it on</div>
              <div className="text-sm font-semibold leading-tight">Google Play</div>
            </div>
          </a>
        </motion.div>

        {/* Accordion */}
        <motion.div {...fadeInUp}>
          <Accordion items={accordionItems} />
        </motion.div>
      </div>
    </section>
  )
}
