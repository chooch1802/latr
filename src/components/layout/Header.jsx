import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { clsx } from 'clsx'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#simplify' },
  { label: 'Calculator', href: '#calculator' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { session, user, profile } = useAuth()

  const initials = profile
    ? `${(profile.first_name?.[0] || '')}${(profile.last_name?.[0] || '')}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-20 h-full flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-navy">
            LATR
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-gray-900 transition-colors duration-200 hover:text-coral-500"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/properties"
              className="text-base font-medium text-gray-900 transition-colors duration-200 hover:text-coral-500"
            >
              Apply Now
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link to="/dashboard">
                  <Button variant="primary" size="sm">Dashboard</Button>
                </Link>
                <div className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center text-sm font-semibold">
                  {initials}
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-coral-500 p-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[60] bg-coral-500 flex flex-col items-center justify-center gap-8"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-white cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-3xl font-bold text-white hover:text-white/80 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/properties"
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-bold text-white hover:text-white/80 transition-colors"
            >
              Apply Now
            </Link>
            {session ? (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" size="lg">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" size="lg">Log in</Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
