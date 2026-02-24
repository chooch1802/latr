export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color || 'bg-gray-100'}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
          <p className="text-2xl font-bold text-navy">{value}</p>
        </div>
      ))}
    </div>
  )
}
