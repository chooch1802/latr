import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    async function handleCallback() {
      try {
        // Check for error in URL hash (e.g. expired link)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const errorDescription = hashParams.get('error_description')
        if (errorDescription) {
          setError(errorDescription)
          return
        }

        // Also check query params for errors (PKCE flow)
        const queryParams = new URLSearchParams(window.location.search)
        const queryError = queryParams.get('error_description')
        if (queryError) {
          setError(queryError)
          return
        }

        // PKCE flow: exchange the code from query params for a session
        const code = queryParams.get('code')
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            setError(exchangeError.message)
            return
          }
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          setError(sessionError.message)
          return
        }

        if (session) {
          await redirectUser(session.user.id)
          return
        }

        // If no session yet, wait for the auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
              await redirectUser(session.user.id)
              subscription.unsubscribe()
            }
          }
        )

        // Timeout after 10 seconds
        const timeout = setTimeout(() => {
          subscription.unsubscribe()
          setError('Sign-in timed out. Please request a new magic link.')
        }, 10000)

        return () => {
          clearTimeout(timeout)
          subscription.unsubscribe()
        }
      } catch {
        setError('Something went wrong. Please try signing in again.')
      }
    }

    async function redirectUser(userId) {
      const { data: profile } = await supabase
        .from('users')
        .select('onboarding_step')
        .eq('id', userId)
        .single()

      if (profile?.onboarding_step >= 5) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/onboarding', { replace: true })
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-navy mb-2">Sign-in failed</h2>
        <p className="text-gray-500 text-sm text-center mb-6 max-w-sm">{error}</p>
        <a
          href="/login"
          className="h-10 px-6 bg-coral-500 text-white font-medium rounded-xl text-sm hover:bg-coral-600 transition-colors inline-flex items-center"
        >
          Back to login
        </a>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Signing you in...</p>
    </div>
  )
}
