import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

function getNextFirstOfMonth() {
  const now = new Date()
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return next
}

function formatCountdown(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

export default function RentDayCountdown() {
  const [countdown, setCountdown] = useState(() => formatCountdown(getNextFirstOfMonth() - Date.now()))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(getNextFirstOfMonth() - Date.now()))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-coral-500" />
        <h3 className="text-sm font-semibold text-navy">Next Rent Day</h3>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { value: countdown.days, label: 'Days' },
          { value: countdown.hours, label: 'Hours' },
          { value: countdown.minutes, label: 'Min' },
          { value: countdown.seconds, label: 'Sec' },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-lg py-2">
            <p className="text-xl font-bold text-navy">{String(item.value).padStart(2, '0')}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
