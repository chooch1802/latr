import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft } from 'lucide-react'
import { loginSchema } from '../lib/validations'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'

export default function ForgotPasswordPage() {
  const { signInWithMagicLink } = useAuth()
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data) {
    try {
      setError(null)
      await signInWithMagicLink(data.email)
      setEmailSent(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (emailSent) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="w-16 h-16 bg-coral-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-coral-500" />
          </div>
          <h1 className="text-2xl font-bold text-navy mb-2">Check your email</h1>
          <p className="text-gray-600 mb-6">
            We sent a magic link to{' '}
            <span className="font-semibold text-navy">{getValues('email')}</span>
          </p>
          <Link
            to="/login"
            className="text-coral-500 font-semibold hover:text-coral-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            Back to login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-navy text-center mb-2">Forgot password?</h1>
      <p className="text-gray-600 text-center mb-8">
        No worries — LATR is passwordless. We&apos;ll send you a magic link.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

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

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm text-coral-500 font-semibold hover:text-coral-600"
        >
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  )
}
