import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, AuBankAccountElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, CheckCircle2, Loader2 } from 'lucide-react'
import { setupMandate } from '../../lib/stripeApi'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

function BECSForm({ onComplete, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    try {
      const { clientSecret } = await setupMandate()

      const auBankAccount = elements.getElement(AuBankAccountElement)
      const { error, setupIntent } = await stripe.confirmAuBecsDebitSetup(clientSecret, {
        payment_method: {
          au_becs_debit: auBankAccount,
          billing_details: { email: '' },
        },
      })

      if (error) {
        onError?.(error.message)
        return
      }

      if (setupIntent?.status === 'succeeded') {
        setComplete(true)
        onComplete?.()
      }
    } catch (err) {
      onError?.(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (complete) {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <span className="text-sm font-medium text-emerald-700">Direct debit mandate set up successfully</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3 mb-3">
        <CreditCard className="w-5 h-5 text-coral-500" />
        <h3 className="font-semibold text-navy">Set Up Direct Debit</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Enter your bank details to set up automatic BECS Direct Debit for weekly repayments.
      </p>

      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <AuBankAccountElement
          options={{
            style: {
              base: {
                color: '#1e293b',
                fontSize: '16px',
                '::placeholder': { color: '#94a3b8' },
              },
            },
          }}
        />
      </div>

      <p className="text-xs text-gray-400">
        By providing your bank account details and confirming this payment, you agree to this
        Direct Debit Request and the Direct Debit Request service agreement, and authorise
        Stripe Payments Australia Pty Ltd ACN 160 180 343 Direct Debit User ID number 507156
        to debit your account through the Bulk Electronic Clearing System (BECS).
      </p>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Setting up...
          </>
        ) : (
          'Set Up Direct Debit'
        )}
      </button>
    </form>
  )
}

export default function BECSSetupForm({ onComplete, onError }) {
  return (
    <Elements stripe={stripePromise}>
      <BECSForm onComplete={onComplete} onError={onError} />
    </Elements>
  )
}
