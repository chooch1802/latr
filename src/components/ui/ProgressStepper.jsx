import { clsx } from 'clsx'

const STEP_LABELS = { 1: 'Type', 2: 'Property', 3: 'Apply', 4: 'Send', 5: 'Complete' }

export default function ProgressStepper({ activeStep = 1 }) {
  const steps = [1, 2, 3, 4, 5]
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      {steps.map((step) => (
        <div
          key={step}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all',
            step === activeStep
              ? 'bg-white text-coral-500 shadow-soft'
              : 'bg-transparent text-white/50 border border-white/20'
          )}
        >
          <span>0{step}</span>
          <span>{STEP_LABELS[step]}</span>
        </div>
      ))}
    </div>
  )
}
