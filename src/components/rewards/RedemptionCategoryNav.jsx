const categories = [
  { value: '', label: 'All' },
  { value: 'rent_credit', label: 'Rent Credit' },
  { value: 'home_deposit', label: 'Home Deposit' },
  { value: 'gift_card', label: 'Gift Cards' },
  { value: 'travel', label: 'Travel' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'dining', label: 'Dining' },
]

export default function RedemptionCategoryNav({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`shrink-0 h-8 px-3 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            value === cat.value
              ? 'bg-coral-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
