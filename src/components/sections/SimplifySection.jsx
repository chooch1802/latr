import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Search, FileText, CheckCircle } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'

const cards = [
  {
    icon: Search,
    label: 'Search Properties',
    description: 'Browse thousands of rental listings from top property portals.',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderHover: 'hover:border-green-200',
  },
  {
    icon: FileText,
    label: 'Apply Instantly',
    description: 'One-click applications with your pre-verified profile.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    raised: true,
    borderHover: 'hover:border-blue-200',
  },
  {
    icon: CheckCircle,
    label: 'Approved!',
    highlight: '$4,000 Funded',
    description: 'LATR pays your landlord or agency directly. You repay weekly.',
    color: 'text-coral-500',
    bgColor: 'bg-coral-50',
    badge: true,
    borderHover: 'hover:border-coral-200',
  },
]

export default function SimplifySection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section id="simplify" ref={sectionRef} className="bg-white py-24 md:py-36" aria-labelledby="simplify-heading">
      <div className="max-w-[1280px] mx-auto px-6 md:px-20">
        <motion.h2
          {...fadeInUp}
          id="simplify-heading"
          className="text-3xl sm:text-4xl md:text-[56px] font-bold text-coral-500 text-center leading-tight tracking-tight mb-16 md:mb-24"
        >
          Simplify your<br />renting
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1080px] mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              whileHover={{ y: -12, boxShadow: '0 16px 48px rgba(255, 90, 61, 0.15)' }}
              className={`bg-white rounded-2xl p-8 border border-gray-100 ${card.borderHover} shadow-soft transition-all duration-300 ${
                card.raised ? 'md:-translate-y-5' : ''
              }`}
              style={{ minHeight: '380px' }}
            >
              <div className={`w-14 h-14 ${card.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">{card.label}</p>
              {card.highlight && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
                  className="text-3xl font-extrabold text-gray-900 mb-3"
                >
                  {card.highlight}
                </motion.p>
              )}
              {card.badge && (
                <span className="inline-block bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  Approved
                </span>
              )}
              <p className="text-gray-500 text-base leading-relaxed">{card.description}</p>

              {/* Decorative mockup lines */}
              <div className="mt-8 space-y-3">
                {[100, 80, 60].map((width, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${width}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 + i * 0.1, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                    className="h-3 bg-gray-100 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
