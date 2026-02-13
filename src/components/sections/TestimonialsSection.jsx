import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { fadeInUp } from '../../utils/animations'

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Student, Sydney',
    avatar: 'SM',
    avatarColor: 'from-purple-400 to-pink-400',
    rating: 5,
    text: "LATR completely changed my renting experience. I was dreading the $4,800 bond for my new place, but Deposit Aid let me spread it over 104 weeks. Moved in the same week I applied.",
  },
  {
    name: 'James T.',
    role: 'Freelancer, Melbourne',
    avatar: 'JT',
    avatarColor: 'from-blue-400 to-cyan-400',
    rating: 5,
    text: "As a freelancer, getting approved for rentals was always a nightmare. LATR's smart application with bank data verification got me approved in under 24 hours. Game changer.",
  },
  {
    name: 'Priya K.',
    role: 'Nurse, Brisbane',
    avatar: 'PK',
    avatarColor: 'from-coral-400 to-orange-400',
    rating: 5,
    text: "The Hub is amazing. My three roommates and I split everything automatically. No more awkward conversations about who owes what. Bills are sorted every month.",
  },
  {
    name: 'Daniel R.',
    role: 'Small Business Owner, Perth',
    avatar: 'DR',
    avatarColor: 'from-green-400 to-emerald-400',
    rating: 5,
    text: "Needed a commercial lease for my cafe but the deposit was killing my cash flow. LATR funded the entire $12,000 bond and I pay it back weekly. Absolute lifesaver for small business.",
  },
  {
    name: 'Emily W.',
    role: 'Graduate, Adelaide',
    avatar: 'EW',
    avatarColor: 'from-amber-400 to-yellow-400',
    rating: 5,
    text: "Applied to 5 properties with one tap. Got accepted for my dream apartment within a week. The whole process felt like booking a hotel room. Why wasn't renting always this easy?",
  },
]

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  }

  const paginate = (newDirection) => {
    setDirection(newDirection)
    setCurrent((prev) => {
      const next = prev + newDirection
      if (next < 0) return testimonials.length - 1
      if (next >= testimonials.length) return 0
      return next
    })
  }

  return (
    <section className="bg-gray-50 py-20 md:py-30 overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="max-w-[1280px] mx-auto px-6 md:px-20">
        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="inline-block border-2 border-coral-500 text-coral-500 text-sm font-semibold uppercase tracking-widest px-5 py-2 rounded-full mb-6">
            Testimonials
          </span>
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl md:text-[56px] font-bold text-gray-900 leading-tight tracking-tight mb-4"
          >
            Loved by renters<br />across Australia
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-[500px] mx-auto">
            Real stories from real people who simplified their renting journey.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-[700px] mx-auto">
          {/* Quote icon */}
          <div className="absolute -top-6 left-8 md:left-12 z-10">
            <div className="w-12 h-12 bg-coral-500 rounded-2xl flex items-center justify-center shadow-coral">
              <Quote className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Card */}
          <div className="relative bg-white rounded-3xl shadow-large p-8 md:p-12 min-h-[300px] flex items-center overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
                className="w-full"
              >
                <div className="flex flex-col gap-6">
                  <StarRating rating={testimonials[current].rating} />

                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                    &ldquo;{testimonials[current].text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[current].avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                      {testimonials[current].avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonials[current].name}</p>
                      <p className="text-sm text-gray-500">{testimonials[current].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1)
                    setCurrent(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === current ? 'w-8 bg-coral-500' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(-1)}
                className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-coral-500 hover:text-coral-500 transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => paginate(1)}
                className="w-12 h-12 rounded-full bg-coral-500 flex items-center justify-center text-white hover:bg-coral-600 transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-3 gap-6 mt-16 max-w-[600px] mx-auto"
        >
          {[
            { value: '4.9', label: 'App Rating' },
            { value: '10,000+', label: 'Happy Renters' },
            { value: '98%', label: 'Approval Rate' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-coral-500">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
