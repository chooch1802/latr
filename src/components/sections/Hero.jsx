import { motion } from 'framer-motion'
import GradientBackground from '../ui/GradientBackground'

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.03,
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
}

function AnimatedText({ text, className }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
          style={char === ' ' ? { width: '0.3em' } : undefined}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero() {
  return (
    <GradientBackground variant="hero" shapes className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Rotating LATR Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="text-[30vw] md:text-[25vw] font-black text-white/[0.04] select-none leading-none tracking-tighter"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          LATR
        </motion.div>
      </div>

      {/* Secondary rotating ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          className="w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full border border-white/[0.06]"
        />
      </div>

      {/* Inner rotating ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
          className="w-[50vw] h-[50vw] md:w-[35vw] md:h-[35vw] rounded-full border border-dashed border-white/[0.05]"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-20 pt-20 pb-32 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-[64px] lg:text-[72px] font-extrabold text-white leading-[1.05] tracking-tight max-w-[800px] mx-auto mb-6"
            id="hero-heading"
          >
            <AnimatedText text="One app for" />
            <br />
            <AnimatedText text="rental freedom" className="block mt-1" />
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          className="text-lg sm:text-xl md:text-2xl text-white/90 font-normal max-w-[600px] mx-auto mb-12"
        >
          Single solution for all your rental needs.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex items-center justify-center"
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-full px-10 h-14 text-coral-500 font-bold text-lg flex items-center justify-center transition-all duration-300"
          >
            Start Now
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-10"
      >
        <motion.a
          href="/contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/25 transition-colors border border-white/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
          Support
        </motion.a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-28 left-8 hidden md:flex flex-col items-center gap-2 z-10"
      >
        <span className="text-white/40 text-xs font-medium tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-8 bg-white/30"
        />
      </motion.div>
    </GradientBackground>
  )
}
