export default function PartnerBonusBadge({ points }) {
  return (
    <span className="inline-flex items-center gap-1 bg-coral-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
      +{points} pts
    </span>
  )
}
