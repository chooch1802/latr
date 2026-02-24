import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, FileText, Landmark, Users } from 'lucide-react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/applications', icon: FileText, label: 'Applications' },
  { to: '/admin/deposits', icon: Landmark, label: 'Deposits' },
  { to: '/admin/users', icon: Users, label: 'Users' },
]

export default function AdminShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white px-6 py-3 flex items-center gap-4">
        <span className="text-lg font-bold tracking-tight">LATR Admin</span>
        <nav className="flex gap-1 ml-6">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white/90'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/dashboard" className="ml-auto text-sm text-white/60 hover:text-white">
          Exit Admin
        </NavLink>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
