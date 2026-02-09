import { Check } from 'lucide-react'

export default function PlanCard({ plan, selected, onSelect }) {
  const isSelected = selected === plan.weeks

  return (
    <button
      type="button"
      onClick={() => onSelect(plan.weeks)}
      className={`w-full text-left rounded-xl border-2 p-5 transition-all cursor-pointer ${
        isSelected
          ? 'border-coral-500 bg-coral-50 shadow-coral'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-lg font-bold text-navy">{plan.label}</p>
          <p className="text-sm text-gray-500">{plan.description}</p>
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-coral-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Weekly payment</span>
          <span className="text-navy font-bold text-base">
            ${plan.weeklyPayment?.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total repayment</span>
          <span className="text-gray-700">${plan.totalRepayment?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Interest ({(plan.interestRate * 100).toFixed(1)}%)</span>
          <span className="text-gray-700">${plan.totalInterest?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Setup fee</span>
          <span className="text-gray-700">${plan.setupFee}</span>
        </div>
      </div>
    </button>
  )
}
