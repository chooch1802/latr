import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Mail, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'

export default function VerifyPage() {
  const { session, loading, signInWithMagicLink } = useAuth()
  const location = useLocation()
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const email = location.state?.email || ''

  useEffect(() => {
    if (resent) {
      const timer = setTimeout(() => setResent(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [resent])

  if (!loading && session) {
    return <Navigate to="/onboarding" replace />
  }

  async function handleResend() {
    if (!email || resending) return
    try {
      setResending(true)
      await signInWithMagicLink(email)
      setResent(true)
    } catch {
      // Silently fail — don't reveal if email exists
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="w-20 h-20 bg-coral-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-coral-500" />
        </div>

        <h1 className="text-2xl font-bold text-navy mb-2">Check your email</h1>
        <p className="text-gray-600 mb-2">
          We sent a magic link to
        </p>
        {email && (
          <p className="font-semibold text-navy mb-6">{email}</p>
        )}

        <p className="text-sm text-gray-500 mb-8">
          Click the link in the email to verify your account and continue.
          If you don&apos;t see it, check your spam folder.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleResend}
            disabled={resending || !email}
            className="inline-flex items-center gap-2 text-coral-500 font-semibold hover:text-coral-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
            {resending ? 'Sending...' : 'Resend magic link'}
          </button>

          {resent && (
            <p className="text-sm text-emerald-600 font-medium">
              Magic link resent! Check your inbox.
            </p>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Magic links expire after 1 hour. You can request a new one at any time.
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
