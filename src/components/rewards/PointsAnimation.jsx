import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PointsAnimation({ points, trigger }) {
  const [show, setShow] = useState(false)
  const [displayPoints, setDisplayPoints] = useState(0)

  useEffect(() => {
    if (!trigger || !points) return
    setShow(true)
    setDisplayPoints(0)

    // Animate counter
    const duration = 800
    const steps = 20
    const increment = points / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= points) {
        setDisplayPoints(points)
        clearInterval(interval)
      } else {
        setDisplayPoints(Math.round(current))
      }
    }, duration / steps)

    const timeout = setTimeout(() => setShow(false), 2500)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [trigger, points])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        >
          <div className="bg-gradient-to-r from-coral-500 to-coral-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-coral-500/30">
            <p className="text-center">
              <span className="text-2xl font-bold">+{displayPoints.toLocaleString('en-AU')}</span>
              <span className="text-sm ml-1 text-white/80">points earned!</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
