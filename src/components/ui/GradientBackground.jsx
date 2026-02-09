import { clsx } from 'clsx'

const gradients = {
  hero: 'bg-gradient-to-br from-coral-500 via-coral-400 to-coral-300',
  coral: 'bg-coral-500',
  coralDark: 'bg-gradient-to-b from-coral-500 to-coral-600',
  coralDeep: 'bg-gradient-to-b from-coral-600 to-coral-700',
  subtle: 'bg-gradient-to-b from-coral-50 to-white',
}

export default function GradientBackground({ variant = 'hero', shapes = false, children, className }) {
  return (
    <div className={clsx('relative overflow-hidden', gradients[variant], className)}>
      {shapes && (
        <>
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl animate-float" />
          <div
            className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/8 blur-3xl animate-float-slow"
            style={{ animationDelay: '-3s' }}
          />
          <div
            className="absolute bottom-[-10%] right-[20%] w-[350px] h-[350px] rounded-full bg-white/5 blur-3xl animate-float-slower"
            style={{ animationDelay: '-6s' }}
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
