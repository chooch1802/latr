import { Link } from 'react-router-dom'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-coral-400 via-coral-500 to-coral-600 px-4 py-12">
      <Link
        to="/"
        className="text-3xl font-extrabold tracking-tight text-white mb-8"
      >
        LATR
      </Link>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  )
}
