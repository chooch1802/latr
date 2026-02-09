import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../lib/validations'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import GoogleButton from '../components/auth/GoogleButton'

export default function LoginPage() {
  const { session, loading, isOnboardingComplete, signInWithMagicLink, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [googleLoading, setGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  if (!loading && session) {
    return <Navigate to={isOnboardingComplete ? '/dashboard' : '/onboarding'} replace />
  }

  async function onSubmit(data) {
    try {
      setError(null)
      await signInWithMagicLink(data.email)
      navigate('/verify', { state: { email: data.email } })
      return
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleGoogle() {
    try {
      setError(null)
      setGoogleLoading(true)
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
      setGoogleLoading(false)
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-navy text-center mb-2">Welcome back</h1>
      <p className="text-gray-600 text-center mb-8">
        Sign in to your LATR account
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <GoogleButton onClick={handleGoogle} disabled={googleLoading} />

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register('email')}
            className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 transition-colors focus:border-coral-500 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Sending link...' : 'Send magic link'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-coral-500 font-semibold hover:text-coral-600">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  )
}
