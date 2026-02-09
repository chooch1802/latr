import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const sizes = {
  sm: 'w-[280px] h-[560px]',
  md: 'w-[300px] h-[600px]',
  lg: 'w-[320px] h-[640px]',
}

export default function PhoneMockup({ children, variant = 'floating', size = 'md', className }) {
  const Wrapper = variant === 'floating' ? motion.div : 'div'
  const wrapperProps = variant === 'floating' ? {
    animate: { y: [0, -12, 0] },
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  } : {}

  return (
    <Wrapper className={clsx('relative', className)} {...wrapperProps}>
      <div
        className={clsx(
          'relative bg-gray-900 rounded-[40px] p-3 shadow-xl',
          sizes[size]
        )}
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-10" />

        {/* Screen */}
        <div className="relative w-full h-full bg-white rounded-[32px] overflow-hidden">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-6 pt-4 pb-2 text-xs font-semibold text-gray-900">
            <span>20:22</span>
            <div className="flex gap-1 items-center">
              <div className="w-4 h-2.5 border border-gray-900 rounded-sm relative">
                <div className="absolute inset-0.5 bg-gray-900 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4 h-[calc(100%-48px)] overflow-hidden">
            {children}
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/50 rounded-full" />
      </div>
    </Wrapper>
  )
}
