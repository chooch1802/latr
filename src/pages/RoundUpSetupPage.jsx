import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check, ArrowRight, Loader2, TrendingUp, DollarSign, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { estimateMonthlyRoundup } from '../lib/roundupCalc'

const steps = [
  { label: 'Deposit', number: 1 },
  { label: 'Rounding', number: 2 },
  { label: 'Confirm', number: 3 },
]

const roundingOptions = [
  { value: 1, label: '$1', description: 'Round to the nearest dollar' },
  { value: 2, label: '$2', description: 'Best balance of impact & ease', recommended: true },
  { value: 5, label: '$5', description: 'Maximum deposit acceleration' },
]

export default function RoundUpSetupPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: deposits
  const [deposits, setDeposits] = useState([])
  const [loadingDeposits, setLoadingDeposits] = useState(true)
  const [selectedDepositId, setSelectedDepositId] = useState(null)

  // Step 2: rounding
  const [roundingAmount, setRoundingAmount] = useState(2)

  // Step 3: confirm
  const [weeklyCap, setWeeklyCap] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Check if user already has roundup settings
  useEffect(() => {
    async function checkExisting() {
      const { data } = await supabase
        .from('roundup_settings')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (data?.length > 0) {
        navigate('/round-up', { replace: true })
      }
    }
    checkExisting()
  }, [user.id, navigate])

  // Fetch active deposits
  useEffect(() => {
    async function fetchDeposits() {
      const { data } = await supabase
        .from('deposit_applications')
        .select('id, deposit_amount, plan_weeks, weekly_payment, status, created_at')
        .eq('user_id', user.id)
        .in('status', ['approved', 'active'])
        .order('created_at', { ascending: false })

      setDeposits(data || [])
      setLoadingDeposits(false)
    }
    fetchDeposits()
  }, [user.id])

  const selectedDeposit = deposits.find((d) => d.id === selectedDepositId)
  const estimate = estimateMonthlyRoundup(roundingAmount)

  function handleSelectDeposit(id) {
    setSelectedDepositId(id)
    setCurrentStep(2)
  }

  function handleSelectRounding(value) {
    setRoundingAmount(value)
  }

  async function handleActivate() {
    if (!selectedDepositId) return
    setSubmitting(true)
    try {
      const { error } = await supabase.from('roundup_settings').insert({
        user_id: user.id,
        deposit_application_id: selectedDepositId,
        enabled: true,
        rounding_amount: roundingAmount,
        weekly_cap: weeklyCap ? Number(weeklyCap) : null,
      })

      if (error) throw error
      toast.success('Round-Up activated! Your spare change now works for you.')
      navigate('/round-up')
    } catch {
      toast.error('Failed to activate Round-Up. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/round-up"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Round-Up
      </Link>

      <h1 className="text-xl font-bold text-navy mb-6">Set Up Round-Up</h1>

      {/* Progress stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep > step.number
                    ? 'bg-emerald-500 text-white'
                    : currentStep === step.number
                      ? 'bg-coral-500 text-white shadow-coral'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span className={`text-xs mt-1 font-medium ${currentStep >= step.number ? 'text-navy' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${currentStep > step.number ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Step 1: Select deposit */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-navy mb-1">Select Deposit</h2>
            <p className="text-sm text-gray-500 mb-4">Choose which deposit your round-ups will contribute to.</p>

            {loadingDeposits ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : deposits.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-3">No active deposit applications found.</p>
                <Link
                  to="/deposit-aid/apply"
                  className="text-sm font-semibold text-coral-500 hover:text-coral-600"
                >
                  Apply for Deposit Aid &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {deposits.map((dep) => (
                  <button
                    key={dep.id}
                    type="button"
                    onClick={() => handleSelectDeposit(dep.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedDepositId === dep.id
                        ? 'border-coral-500 bg-coral-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-navy">
                      ${Number(dep.deposit_amount).toLocaleString('en-AU')} Deposit
                    </p>
                    <p className="text-sm text-gray-500">
                      {dep.plan_weeks} weeks · ${Number(dep.weekly_payment).toFixed(2)}/week · <span className="capitalize">{dep.status}</span>
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Choose rounding amount */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-navy mb-1">Choose Rounding</h2>
            <p className="text-sm text-gray-500 mb-4">How much do you want to round up each purchase?</p>

            <div className="space-y-3 mb-6">
              {roundingOptions.map((opt) => {
                const est = estimateMonthlyRoundup(opt.value)
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectRounding(opt.value)}
                    className={`relative w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      roundingAmount === opt.value
                        ? 'border-coral-500 bg-coral-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {opt.recommended && (
                      <span className="absolute -top-2.5 right-3 bg-coral-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-navy text-lg">{opt.label}</p>
                        <p className="text-sm text-gray-500">{opt.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-coral-500">~${est.monthly}</p>
                        <p className="text-xs text-gray-400">/month</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Estimated impact */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Estimated Impact</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-navy">${estimate.weekly}</p>
                  <p className="text-xs text-gray-500">Weekly</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-navy">${estimate.monthly}</p>
                  <p className="text-xs text-gray-500">Monthly</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-navy">${estimate.yearly}</p>
                  <p className="text-xs text-gray-500">Yearly</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex-1 h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-navy mb-1">Confirm Round-Up</h2>
            <p className="text-sm text-gray-500 mb-4">Review your settings before activating.</p>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Linked deposit</span>
                <span className="text-navy font-semibold">
                  ${selectedDeposit ? Number(selectedDeposit.deposit_amount).toLocaleString('en-AU') : '—'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rounding amount</span>
                <span className="text-navy font-semibold">${roundingAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated monthly</span>
                <span className="text-coral-500 font-semibold">~${estimate.monthly}</span>
              </div>
            </div>

            {/* Weekly cap */}
            <div className="mb-6">
              <label htmlFor="weekly-cap" className="block text-sm font-medium text-gray-700 mb-1">
                Weekly cap (optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="weekly-cap"
                  type="number"
                  min="1"
                  step="1"
                  value={weeklyCap}
                  onChange={(e) => setWeeklyCap(e.target.value)}
                  placeholder="No limit"
                  className="w-full h-11 pl-8 pr-4 rounded-xl border border-gray-300 text-navy focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Set a maximum weekly round-up amount, or leave blank for no limit.</p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
              <Feature icon={TrendingUp} text="Round-ups are applied to your deposit automatically" />
              <Feature icon={DollarSign} text="You can change your rounding amount anytime" />
              <Feature icon={Shield} text="Disable or pause Round-Up at any time" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleActivate}
                disabled={submitting}
                className="flex-1 h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  <>
                    Activate Round-Up
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Feature({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Icon className="w-4 h-4 text-coral-500 shrink-0" />
      <span>{text}</span>
    </div>
  )
}
