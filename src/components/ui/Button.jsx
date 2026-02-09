import { clsx } from 'clsx'
import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-coral-500 text-white hover:bg-coral-600 shadow-soft hover:shadow-medium',
  secondary: 'bg-transparent border-2 border-white text-white hover:bg-white/10',
  outline: 'bg-transparent border-2 border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white',
}

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
}

export default function Button({ variant = 'primary', size = 'md', children, className, icon, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer',
        variants[variant],
        sizes[size],
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-2 focus:outline-offset-2 focus:outline-coral-500',
        className
      )}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </motion.button>
  )
}
