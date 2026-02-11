import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../lib/validations'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import GoogleButton from '../components/auth/GoogleButton'
import OTPInput from '../components/auth/OTPInput'

function formatPhoneE164(phone) {
  const cleaned = phone.replace(/\s/g, '')
  return '+61' + cleaned.substring(1)
}

export default function LoginPage() {
  const { session, loading, isOnboardingComplete, signInWithPhone, verifyOtp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [otpError, setOtpError] = useState(null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [phase, setPhase] = useState('phone') // 'phone' | 'otp'
  const [phone, setPhone] = useState('')

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
      const e164 = formatPhoneE164(data.phone)
      await signInWithPhone(e164)
      setPhone(e164)
      setPhase('otp')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleVerify(code) {
    try {
      setOtpError(null)
      await verifyOtp(phone, code)
      navigate(isOnboardingComplete ? '/dashboard' : '/onboarding', { replace: true })
    } catch (err) {
      setOtpError(err.message)
    }
  }

  async function handleResend() {
    try {
      setOtpError(null)
      await signInWithPhone(phone)
    } catch (err) {
      setOtpError(err.message)
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

  if (phase === 'otp') {
    return (
      <AuthLayout>
        <h1 className="text-2xl font-bold text-navy text-center mb-6">Enter verification code</h1>
        <OTPInput
          phone={phone}
          onVerify={handleVerify}
          onResend={handleResend}
          onChangeNumber={() => {
            setPhase('phone')
            setOtpError(null)
          }}
          error={otpError}
        />
      </AuthLayout>
    )
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
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 h-12 rounded-l-xl border-2 border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
              +61
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="0412 345 678"
              {...register('phone')}
              className="flex-1 h-12 px-4 rounded-r-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 transition-colors focus:border-coral-500 focus:outline-none"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Sending code...' : 'Send code'}
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
