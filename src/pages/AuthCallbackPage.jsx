import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    async function handleCallback() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Check onboarding status
        const { data: profile } = await supabase
          .from('users')
          .select('onboarding_step')
          .eq('id', session.user.id)
          .single()

        if (profile?.onboarding_step >= 5) {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/onboarding', { replace: true })
        }
        return
      }

      // Listen for sign-in event if session doesn't exist yet
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            const { data: profile } = await supabase
              .from('users')
              .select('onboarding_step')
              .eq('id', session.user.id)
              .single()

            if (profile?.onboarding_step >= 5) {
              navigate('/dashboard', { replace: true })
            } else {
              navigate('/onboarding', { replace: true })
            }
            subscription.unsubscribe()
          }
        }
      )

      return () => subscription.unsubscribe()
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-600 font-medium">Signing you in...</p>
    </div>
  )
}
