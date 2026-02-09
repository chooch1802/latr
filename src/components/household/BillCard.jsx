import { Link } from 'react-router-dom'
import { Zap, Wifi, Droplet, Flame, Home, HelpCircle } from 'lucide-react'
import BillStatusBadge from './BillStatusBadge'

const categoryIcons = {
  rent: Home,
  electricity: Zap,
  internet: Wifi,
  water: Droplet,
  gas: Flame,
  insurance: HelpCircle,
  other: HelpCircle,
}

const categoryColors = {
  rent: 'bg-coral-50 text-coral-500',
  electricity: 'bg-yellow-50 text-yellow-600',
  internet: 'bg-blue-50 text-blue-500',
  water: 'bg-cyan-50 text-cyan-600',
  gas: 'bg-orange-50 text-orange-500',
  insurance: 'bg-purple-50 text-purple-500',
  other: 'bg-gray-100 text-gray-500',
}

export default function BillCard({ bill, userShare }) {
  const Icon = categoryIcons[bill.category] || HelpCircle
  const color = categoryColors[bill.category] || categoryColors.other

  return (
    <Link
      to={`/household/bills/${bill.id}`}
      className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm hover:border-gray-300 transition-all"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-navy text-sm truncate capitalize">{bill.title || bill.category}</p>
        <p className="text-xs text-gray-500">
          Due {new Date(bill.due_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
          {userShare != null && ` · Your share: $${Number(userShare).toFixed(2)}`}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="font-bold text-navy text-sm">${Number(bill.total_amount).toFixed(2)}</p>
        <BillStatusBadge status={bill.status} />
      </div>
    </Link>
  )
}

export { categoryIcons, categoryColors }
