const tierOrder = ['bronze', 'silver', 'gold', 'platinum']
const tierThresholds = { bronze: 0, silver: 5000, gold: 15000, platinum: 35000 }
const tierColors = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#A78BFA',
}

export default function TierProgressBar({ currentTier = 'bronze', qualifyingPoints = 0 }) {
  const currentIdx = tierOrder.indexOf(currentTier)
  const nextTier = currentIdx < tierOrder.length - 1 ? tierOrder[currentIdx + 1] : null

  if (!nextTier) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-navy">Tier Progress</span>
          <span className="text-xs font-medium text-purple-600">Max Tier Reached!</span>
        </div>
        <div className="h-2.5 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
        <p className="text-xs text-gray-500 mt-2">
          You&apos;ve reached Platinum — enjoy all premium perks.
        </p>
      </div>
    )
  }

  const currentThreshold = tierThresholds[currentTier]
  const nextThreshold = tierThresholds[nextTier]
  const progress = Math.min(
    ((qualifyingPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100,
    100
  )
  const pointsNeeded = Math.max(nextThreshold - qualifyingPoints, 0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-navy">Tier Progress</span>
        <span className="text-xs text-gray-500">
          {pointsNeeded.toLocaleString('en-AU')} pts to {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.max(progress, 2)}%`,
            background: `linear-gradient(90deg, ${tierColors[currentTier]}, ${tierColors[nextTier]})`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-gray-400 capitalize">{currentTier}</span>
        <span className="text-xs text-gray-400 capitalize">{nextTier}</span>
      </div>
    </div>
  )
}
