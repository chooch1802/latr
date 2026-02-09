import { Link } from 'react-router-dom'
import { Home, FileText, Landmark, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const cards = [
  {
    title: 'Browse Properties',
    description: 'Search available rentals and apply instantly.',
    icon: Home,
    href: '/properties',
    color: 'bg-purple-50 text-purple-500',
  },
  {
    title: 'My Applications',
    description: 'Track and manage your rental applications.',
    icon: FileText,
    href: '/apply',
    color: 'bg-coral-50 text-coral-500',
  },
  {
    title: 'Deposit Aid',
    description: 'LATR pays your deposit directly to your landlord or agency.',
    icon: Landmark,
    href: '/deposit-aid',
    color: 'bg-blue-50 text-blue-500',
  },
  {
    title: 'Household Hub',
    description: 'Manage roommates, leases, and shared expenses.',
    icon: Users,
    href: '/household',
    color: 'bg-emerald-50 text-emerald-500',
  },
]

export default function DashboardPage() {
  const { profile, user } = useAuth()

  const firstName = profile?.first_name || user?.user_metadata?.first_name || 'there'

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-1">
        Welcome back, {firstName}
      </h1>
      <p className="text-gray-500 mb-8">Here&apos;s what you can do with LATR.</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            to={card.href}
            className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-medium hover:border-gray-300"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-navy mb-1 group-hover:text-coral-500 transition-colors">
              {card.title}
            </h2>
            <p className="text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
