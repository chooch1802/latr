export default function PointsEarnCard({ icon: Icon, title, description, points, color = 'bg-coral-50 text-coral-500' }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-navy">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-sm font-bold text-coral-500">+{points}</span>
          <p className="text-[10px] text-gray-400">pts</p>
        </div>
      </div>
    </div>
  )
}
