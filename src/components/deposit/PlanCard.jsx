export default function PlanCard({ plan, selected, onSelect }) {
  const isSelected = selected === plan.weeks

  return (
    <button
      type="button"
      onClick={() => onSelect(plan.weeks)}
      className={`w-full flex items-center justify-between rounded-xl border-2 p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-coral-500 bg-coral-50 shadow-coral'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-lg font-bold text-navy">{plan.label}</p>
          {plan.badge && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${plan.badgeColor}`}>
              {plan.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          ${plan.weeklyPayment?.toFixed(2)}/week · {(plan.interestRate * 100).toFixed(1)}% interest
        </p>
      </div>

      {/* Radio circle */}
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-4 ${
        isSelected ? 'border-coral-500' : 'border-gray-300'
      }`}>
        {isSelected && <div className="w-3 h-3 rounded-full bg-coral-500" />}
      </div>
    </button>
  )
}
