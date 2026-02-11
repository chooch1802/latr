import { useState, useRef, useEffect, useCallback } from 'react'

export default function OTPInput({ phone, onVerify, onResend, onChangeNumber, error }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(30)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const inputsRef = useRef([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendTimer <= 0) return
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [resendTimer])

  const handleVerify = useCallback(
    async (code) => {
      if (verifying) return
      setVerifying(true)
      try {
        await onVerify(code)
      } finally {
        setVerifying(false)
      }
    },
    [onVerify, verifying]
  )

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return

    const next = [...digits]
    next[index] = value
    setDigits(next)

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }

    if (value && next.every((d) => d !== '')) {
      handleVerify(next.join(''))
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const next = [...digits]
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || ''
    }
    setDigits(next)

    const focusIndex = Math.min(pasted.length, 5)
    inputsRef.current[focusIndex]?.focus()

    if (pasted.length === 6) {
      handleVerify(pasted)
    }
  }

  async function handleResend() {
    if (resendTimer > 0 || resending) return
    setResending(true)
    try {
      await onResend()
      setResendTimer(30)
      setDigits(['', '', '', '', '', ''])
      inputsRef.current[0]?.focus()
    } finally {
      setResending(false)
    }
  }

  const code = digits.join('')
  const isComplete = code.length === 6

  return (
    <div className="text-center">
      <p className="text-gray-600 mb-1">We sent a code to</p>
      <p className="font-semibold text-navy mb-6">{phone}</p>

      <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 text-gray-900 transition-colors focus:border-coral-500 focus:outline-none"
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <button
        onClick={() => handleVerify(code)}
        disabled={!isComplete || verifying}
        className="w-full h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mb-4"
      >
        {verifying ? 'Verifying...' : 'Verify'}
      </button>

      <div className="space-y-2">
        <button
          onClick={handleResend}
          disabled={resendTimer > 0 || resending}
          className="text-sm text-coral-500 font-semibold hover:text-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {resending
            ? 'Sending...'
            : resendTimer > 0
              ? `Resend code in ${resendTimer}s`
              : 'Resend code'}
        </button>

        <div>
          <button
            onClick={onChangeNumber}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            Change number
          </button>
        </div>
      </div>
    </div>
  )
}
