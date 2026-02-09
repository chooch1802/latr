import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const variants = {
  default: 'bg-white shadow-soft',
  glass: 'glass',
  elevated: 'bg-white shadow-medium',
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({ variant = 'default', padding = 'md', hover = false, children, className, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -8, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)' } : undefined}
      transition={{ duration: 0.2 }}
      className={clsx(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
