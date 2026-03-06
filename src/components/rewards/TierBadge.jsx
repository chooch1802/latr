const tierColors = {
  silver: 'bg-gray-100 text-gray-700 border-gray-200',
  gold: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  platinum: 'bg-purple-100 text-purple-700 border-purple-200',
}

export default function TierBadge({ tier = 'silver', size = 'sm' }) {
  const colors = tierColors[tier] || tierColors.silver
  const sizeClasses = size === 'lg'
    ? 'text-sm px-3 py-1'
    : 'text-xs px-2 py-0.5'

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold capitalize ${colors} ${sizeClasses}`}>
      {tier}
    </span>
  )
}
