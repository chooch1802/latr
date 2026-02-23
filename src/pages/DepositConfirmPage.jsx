import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Loader2, Landmark } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { generateRepaymentSchedule } from '../lib/depositCalc'
import { createPayout } from '../lib/airwallexApi'
import BECSSetupForm from '../components/deposit/BECSSetupForm'

export default function DepositConfirmPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [deposit, setDeposit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)
  const [activated, setActivated] = useState(false)
  const [mandateActive, setMandateActive] = useState(false)

  useEffect(() => {
    async function fetch() {
      const [depositRes, userRes] = await Promise.all([
        supabase
          .from('deposit_applications')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('users')
          .select('stripe_mandate_status')
          .eq('id', user.id)
          .single(),
      ])
      if (depositRes.error) {
        navigate('/deposit-aid', { replace: true })
        return
      }
      setDeposit(depositRes.data)
      setMandateActive(userRes.data?.stripe_mandate_status === 'active')
      setLoading(false)
    }
    fetch()
  }, [id, user.id, navigate])

  async function handleActivate() {
    if (!deposit) return
    setActivating(true)
    try {
      // Generate repayment schedule
      const schedule = generateRepaymentSchedule(
        deposit.deposit_amount,
        deposit.plan_weeks,
        new Date()
      )

      // Insert repayments
      if (schedule.length > 0) {
        await supabase.from('repayments').insert(
          schedule.map((week) => ({
            deposit_application_id: deposit.id,
            week_number: week.weekNumber,
            due_date: week.dueDate,
            amount: week.amount,
            status: 'upcoming',
          }))
        )
      }

      // Update deposit status to active
      await supabase
        .from('deposit_applications')
        .update({
          status: 'active',
          approved_at: new Date().toISOString(),
          transfer_status: 'processing',
        })
        .eq('id', deposit.id)

      // Trigger real payout to landlord/agency via Airwallex
      try {
        await createPayout(deposit.id)
      } catch {
        // Payout will be retried — don't block activation
      }

      setActivated(true)
    } catch (err) {
      toast.error('Failed to activate deposit. Please try again.')
    } finally {
      setActivating(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto animate-pulse space-y-4 py-12">
        <div className="h-20 bg-gray-200 rounded-full w-20 mx-auto" />
        <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  if (activated) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">Deposit Aid Activated!</h1>
        <p className="text-gray-500 mb-2">
          Your ${Number(deposit.deposit_amount).toLocaleString('en-AU')} deposit payment is being processed.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          The funds will be transferred to {deposit.recipient_name} within 1-2 business days.
          Your first weekly payment of ${Number(deposit.weekly_payment).toFixed(2)} is due in 7 days.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to={`/deposit-aid/${deposit.id}`}
            className="h-11 px-6 bg-coral-500 text-white font-semibold rounded-xl inline-flex items-center gap-2 transition-colors hover:bg-coral-600"
          >
            View Repayment Schedule
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/deposit-aid"
            className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl inline-flex items-center transition-colors hover:bg-gray-50"
          >
            Deposit Aid Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Landmark className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-xl font-bold text-navy mb-1">Confirm Deposit Aid</h1>
        <p className="text-sm text-gray-500">Review the details below and activate your deposit aid.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4 space-y-3">
        <Row label="Deposit amount" value={`$${Number(deposit.deposit_amount).toLocaleString('en-AU')}`} bold />
        <Row label="Repayment plan" value={`${deposit.plan_weeks} weeks`} />
        <Row label="Weekly payment" value={`$${Number(deposit.weekly_payment).toFixed(2)}`} />
        <Row label="Total repayment" value={`$${Number(deposit.total_repayment).toFixed(2)}`} />
        <Row label="Interest rate" value={`${((deposit.interest_rate || 0.25) * 100).toFixed(1)}%`} />
        <div className="border-t pt-3">
          <Row label="Recipient" value={deposit.recipient_name} />
          <Row label="BSB" value={deposit.recipient_bsb} />
          <Row label="Account" value={deposit.recipient_account} />
          <Row label="Type" value={deposit.recipient_type} />
        </div>
      </div>

      {/* BECS Direct Debit setup — required before activation */}
      {!mandateActive && (
        <div className="mb-6">
          <BECSSetupForm
            onComplete={() => setMandateActive(true)}
            onError={(msg) => toast.error(msg)}
          />
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700 mb-6">
        By activating, you agree to the repayment terms above. LATR will transfer ${Number(deposit.deposit_amount).toLocaleString('en-AU')} to {deposit.recipient_name} and you'll repay ${Number(deposit.weekly_payment).toFixed(2)}/week for {deposit.plan_weeks} weeks.
      </div>

      <button
        type="button"
        onClick={handleActivate}
        disabled={activating || !mandateActive}
        className="w-full h-12 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        {activating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Activating...
          </>
        ) : !mandateActive ? (
          'Set up direct debit to activate'
        ) : (
          <>
            Activate Deposit Aid
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`text-navy ${bold ? 'font-bold text-base' : 'font-medium'} capitalize`}>{value || '—'}</span>
    </div>
  )
}
