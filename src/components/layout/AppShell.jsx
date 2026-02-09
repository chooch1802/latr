import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Home, FileText, Landmark, Users, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import NotificationBell from './NotificationBell'
import PageTransition from './PageTransition'
import SupportChatbot from '../chat/SupportChatbot'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Properties', href: '/properties', icon: Home },
  { label: 'Applications', href: '/apply', icon: FileText },
  { label: 'Deposit Aid', href: '/deposit-aid', icon: Landmark },
  { label: 'Household', href: '/household', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
]

// Bottom tab bar shows first 5 items on mobile
const mobileTabItems = navItems.slice(0, 5)

export default function AppShell() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()

  const initials = profile
    ? `${(profile.first_name?.[0] || '')}${(profile.last_name?.[0] || '')}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : user?.email || ''

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-extrabold tracking-tight text-navy">LATR</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-coral-50 text-coral-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
          {/* Mobile logo */}
          <span className="md:hidden text-xl font-extrabold tracking-tight text-navy">LATR</span>
          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <NotificationBell />
            <span className="text-sm text-gray-600 hidden sm:block">{displayName}</span>
            <NavLink to="/settings" className="md:hidden">
              <div className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center text-sm font-semibold">
                {initials}
              </div>
            </NavLink>
            <div className="hidden md:flex w-9 h-9 rounded-full bg-coral-500 text-white items-center justify-center text-sm font-semibold">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 pb-24 md:pb-8 lg:p-8">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {mobileTabItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                  isActive
                    ? 'text-coral-500'
                    : 'text-gray-400'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <SupportChatbot />
    </div>
  )
}
