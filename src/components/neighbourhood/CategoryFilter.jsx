const categories = [
  { value: '', label: 'All' },
  { value: 'dining', label: 'Dining' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'retail', label: 'Retail' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'services', label: 'Services' },
  { value: 'health', label: 'Health' },
]

export default function CategoryFilter({ value, onChange, suburbs = [], suburbValue, onSuburbChange }) {
  return (
    <div className="space-y-2">
      {/* Category pills */}
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

      {/* Suburb pills */}
      {suburbs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          <button
            onClick={() => onSuburbChange('')}
            className={`shrink-0 h-7 px-2.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              !suburbValue
                ? 'bg-navy text-white'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            All suburbs
          </button>
          {suburbs.map((sub) => (
            <button
              key={sub}
              onClick={() => onSuburbChange(sub)}
              className={`shrink-0 h-7 px-2.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                suburbValue === sub
                  ? 'bg-navy text-white'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
