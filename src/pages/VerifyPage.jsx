import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/auth/AuthLayout'
import OTPInput from '../components/auth/OTPInput'

export default function VerifyPage() {
  const { session, loading, signInWithPhone, verifyOtp } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [otpError, setOtpError] = useState(null)

  const phone = location.state?.phone || ''

  if (!loading && session) {
    return <Navigate to="/onboarding" replace />
  }

  if (!phone) {
    return <Navigate to="/login" replace />
  }

  async function handleVerify(code) {
    try {
      setOtpError(null)
      await verifyOtp(phone, code)
      navigate('/onboarding', { replace: true })
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

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-navy text-center mb-6">Enter verification code</h1>
      <OTPInput
        phone={phone}
        onVerify={handleVerify}
        onResend={handleResend}
        onChangeNumber={() => navigate('/login', { replace: true })}
        error={otpError}
      />
    </AuthLayout>
  )
}
