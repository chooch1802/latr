import { clsx } from 'clsx'

export default function ProgressStepper({ activeStep = 1, labels = {} }) {
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
          {labels[step] && <span>{labels[step]}</span>}
        </div>
      ))}
    </div>
  )
}
