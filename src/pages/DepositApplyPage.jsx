import { useState, useEffect, useMemo, forwardRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { depositRecipientSchema } from '../lib/validations'
import { calculateAllPlans, calculatePlan, SETUP_FEE } from '../lib/depositCalc'
import { runAssessment as runServerAssessment } from '../lib/basiqApi'
import PlanCard from '../components/deposit/PlanCard'
import BusinessVerificationStep from '../components/deposit/BusinessVerificationStep'

const PERSONAL_STEPS = [
  { label: 'Application', key: 'application' },
  { label: 'Details', key: 'details' },
  { label: 'Plan', key: 'plan' },
  { label: 'Assessment', key: 'assessment' },
]

const BUSINESS_STEPS = [
  { label: 'Application', key: 'application' },
  { label: 'Business', key: 'business' },
  { label: 'Details', key: 'details' },
  { label: 'Plan', key: 'plan' },
  { label: 'Assessment', key: 'assessment' },
]

export default function DepositApplyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [currentStep, setCurrentStep] = useState(1)

  // Applicant type toggle
  const [applicantType, setApplicantType] = useState('personal')

  const steps = useMemo(
    () => (applicantType === 'business' ? BUSINESS_STEPS : PERSONAL_STEPS),
    [applicantType]
  )

  // Map step index to key for readability
  const currentStepKey = steps[currentStep - 1]?.key

  // Step 1: select an approved application
  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(true)
  const [selectedAppId, setSelectedAppId] = useState(null)

  // Business verification
  const [depositAppId, setDepositAppId] = useState(null)
  const [businessVerification, setBusinessVerification] = useState(null)

  // Details: amount + recipient
  const [depositAmount, setDepositAmount] = useState('')

  // Plan selection
  const [selectedWeeks, setSelectedWeeks] = useState(null)

  // Credit assessment
  const [assessing, setAssessing] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const maxDeposit = applicantType === 'business' ? 200000 : 50000

  const recipientForm = useForm({
    resolver: zodResolver(depositRecipientSchema),
    defaultValues: {
      recipientType: '',
      recipientName: '',
      recipientBsb: '',
      recipientAccount: '',
      recipientEmail: '',
      agentName: '',
    },
  })

  // Fetch approved applications
  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('applications')
        .select('id, property_address_line_1, property_suburb, property_state, deposit_amount, status')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      setApplications(data || [])
      setLoadingApps(false)
    }
    fetch()
  }, [user.id])

  const selectedApp = applications.find((a) => a.id === selectedAppId)
  const numAmount = Number(depositAmount) || 0
  const plans = numAmount >= 1000 && numAmount <= maxDeposit ? calculateAllPlans(numAmount) : []
  const selectedPlan = selectedWeeks ? calculatePlan(numAmount, selectedWeeks) : null

  function goToStep(key) {
    const idx = steps.findIndex((s) => s.key === key)
    if (idx !== -1) setCurrentStep(idx + 1)
  }

  function handleSelectApplication(appId) {
    setSelectedAppId(appId)
    const app = applications.find((a) => a.id === appId)
    if (app?.deposit_amount) {
      setDepositAmount(String(app.deposit_amount))
    }
    goToStep(applicantType === 'business' ? 'business' : 'details')
  }

  function handleApplicantTypeChange(type) {
    setApplicantType(type)
    // Reset to step 1 when changing type
    setCurrentStep(1)
    setBusinessVerification(null)
    setDepositAppId(null)
  }

  async function handleRecipientNext() {
    if (numAmount < 1000 || numAmount > maxDeposit) return
    goToStep('plan')
  }

  function handlePlanNext() {
    if (!selectedWeeks) return
    goToStep('assessment')
    runAssessment()
  }

  async function runAssessment() {
    setAssessing(true)
    try {
      const result = await runServerAssessment()
      setAssessment(result)
    } catch {
      setAssessment({ approved: false, score: 0, creditLimit: 0, factors: [] })
    } finally {
      setAssessing(false)
    }
  }

  async function handleSubmit() {
    if (!assessment?.approved || !selectedPlan) return
    setSubmitting(true)
    try {
      const recipientData = recipientForm.getValues()

      // If we already created a deposit_application for business verification, update it
      if (depositAppId) {
        const { error } = await supabase
          .from('deposit_applications')
          .update({
            application_id: selectedAppId,
            deposit_amount: numAmount,
            plan_weeks: selectedWeeks,
            weekly_payment: selectedPlan.weeklyPayment,
            total_repayment: selectedPlan.totalRepayment,
            setup_fee: SETUP_FEE,
            interest_rate: selectedPlan.interestRate,
            status: 'approved',
            credit_score: assessment.score,
            credit_limit: assessment.creditLimit,
            recipient_type: recipientData.recipientType,
            recipient_name: recipientData.recipientName,
            recipient_bsb: recipientData.recipientBsb,
            recipient_account: recipientData.recipientAccount,
            recipient_email: recipientData.recipientEmail || null,
            agent_name: recipientData.agentName || null,
            equifax_score: assessment.equifaxScore || null,
          })
          .eq('id', depositAppId)

        if (error) throw error
        navigate(`/deposit-aid/confirm/${depositAppId}`)
      } else {
        const { data, error } = await supabase
          .from('deposit_applications')
          .insert({
            user_id: user.id,
            application_id: selectedAppId,
            applicant_type: applicantType,
            deposit_amount: numAmount,
            plan_weeks: selectedWeeks,
            weekly_payment: selectedPlan.weeklyPayment,
            total_repayment: selectedPlan.totalRepayment,
            setup_fee: SETUP_FEE,
            interest_rate: selectedPlan.interestRate,
            status: 'approved',
            credit_score: assessment.score,
            credit_limit: assessment.creditLimit,
            recipient_type: recipientData.recipientType,
            recipient_name: recipientData.recipientName,
            recipient_bsb: recipientData.recipientBsb,
            recipient_account: recipientData.recipientAccount,
            recipient_email: recipientData.recipientEmail || null,
            agent_name: recipientData.agentName || null,
            equifax_score: assessment.equifaxScore || null,
          })
          .select()
          .single()

        if (error) throw error
        navigate(`/deposit-aid/confirm/${data.id}`)
      }
    } catch (err) {
      toast.error('Failed to create deposit application. Please try again.')
      setSubmitting(false)
    }
  }

  // For business flow: create deposit_application early so verify-business can reference it
  async function ensureDepositApp() {
    if (depositAppId) return depositAppId
    const { data, error } = await supabase
      .from('deposit_applications')
      .insert({
        user_id: user.id,
        application_id: selectedAppId,
        applicant_type: 'business',
        deposit_amount: numAmount >= 1000 ? numAmount : 1000,
        plan_weeks: 104,
        weekly_payment: 1,
        total_repayment: 1,
        status: 'pending',
      })
      .select()
      .single()
    if (error) throw error
    setDepositAppId(data.id)
    return data.id
  }

  async function handleBusinessVerified(result) {
    setBusinessVerification(result)
    goToStep('details')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/deposit-aid"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deposit Aid
      </Link>

      <h1 className="text-xl font-bold text-navy mb-6">Apply for Deposit Aid</h1>

      {/* Progress stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, i) => (
          <div key={step.key} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep > i + 1
                    ? 'bg-emerald-500 text-white'
                    : currentStep === i + 1
                      ? 'bg-coral-500 text-white shadow-coral'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium ${currentStep >= i + 1 ? 'text-navy' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${currentStep > i + 1 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Step: Select approved application */}
        {currentStepKey === 'application' && (
          <div>
            <h2 className="text-lg font-semibold text-navy mb-1">Select Application</h2>
            <p className="text-sm text-gray-500 mb-4">Choose the approved rental application you need deposit help for.</p>

            {/* Applicant type toggle */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Applicant type</label>
              <div className="flex gap-3">
                {[
                  { value: 'personal', label: 'Personal' },
                  { value: 'business', label: 'Business' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleApplicantTypeChange(type.value)}
                    className={`flex-1 h-11 rounded-xl border-2 text-sm font-medium cursor-pointer transition-all ${
                      applicantType === type.value
                        ? 'border-coral-500 bg-coral-50 text-coral-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingApps ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-3">No approved applications yet.</p>
                <Link
                  to="/apply"
                  className="text-sm font-semibold text-coral-500 hover:text-coral-600"
                >
                  View my applications &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => handleSelectApplication(app.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedAppId === app.id
                        ? 'border-coral-500 bg-coral-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-navy">
                      {app.property_address_line_1}
                      {app.property_suburb ? `, ${app.property_suburb}` : ''}
                    </p>
                    <p className="text-sm text-gray-500">
                      Deposit: ${Number(app.deposit_amount).toLocaleString('en-AU')} · {app.property_state}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step: Business Verification (business only) */}
        {currentStepKey === 'business' && (
          <BusinessVerificationStep
            depositApplicationId={depositAppId}
            onEnsureDepositApp={ensureDepositApp}
            onComplete={handleBusinessVerified}
            onBack={() => goToStep('application')}
          />
        )}

        {/* Step: Amount + recipient details */}
        {currentStepKey === 'details' && (
          <form onSubmit={recipientForm.handleSubmit(handleRecipientNext)}>
            <h2 className="text-lg font-semibold text-navy mb-1">Deposit Details</h2>
            <p className="text-sm text-gray-500 mb-4">Enter the deposit amount and the landlord or agency LATR will pay directly.</p>

            {/* Amount */}
            <div className="mb-5">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Deposit amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  id="amount"
                  type="number"
                  min="1000"
                  max={maxDeposit}
                  step="100"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full h-11 pl-8 pr-4 rounded-xl border border-gray-300 text-navy font-semibold focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                />
              </div>
              {numAmount > 0 && (numAmount < 1000 || numAmount > maxDeposit) && (
                <p className="text-xs text-red-500 mt-1">Must be between $1,000 and ${maxDeposit.toLocaleString('en-AU')}</p>
              )}
            </div>

            {/* Recipient type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment recipient</label>
              <div className="flex gap-3">
                {['landlord', 'agency'].map((type) => (
                  <label
                    key={type}
                    className={`flex-1 flex items-center justify-center h-11 rounded-xl border-2 text-sm font-medium cursor-pointer transition-all ${
                      recipientForm.watch('recipientType') === type
                        ? 'border-coral-500 bg-coral-50 text-coral-600'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      {...recipientForm.register('recipientType')}
                      className="sr-only"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
              {recipientForm.formState.errors.recipientType && (
                <p className="text-xs text-red-500 mt-1">{recipientForm.formState.errors.recipientType.message}</p>
              )}
            </div>

            <Field
              label="Recipient name"
              error={recipientForm.formState.errors.recipientName}
              {...recipientForm.register('recipientName')}
            />

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="BSB"
                placeholder="XXX-XXX"
                error={recipientForm.formState.errors.recipientBsb}
                {...recipientForm.register('recipientBsb')}
              />
              <Field
                label="Account number"
                placeholder="6-9 digits"
                error={recipientForm.formState.errors.recipientAccount}
                {...recipientForm.register('recipientAccount')}
              />
            </div>

            <Field
              label="Recipient email (optional)"
              type="email"
              error={recipientForm.formState.errors.recipientEmail}
              {...recipientForm.register('recipientEmail')}
            />

            {recipientForm.watch('recipientType') === 'agency' && (
              <Field
                label="Agent name (optional)"
                error={recipientForm.formState.errors.agentName}
                {...recipientForm.register('agentName')}
              />
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => goToStep(applicantType === 'business' ? 'business' : 'application')}
                className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={numAmount < 1000 || numAmount > maxDeposit}
                className="flex-1 h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Step: Choose plan */}
        {currentStepKey === 'plan' && (
          <div>
            <h2 className="text-lg font-semibold text-navy mb-1">Choose Your Plan</h2>
            <p className="text-sm text-gray-500 mb-4">
              Select a repayment plan for your ${numAmount.toLocaleString('en-AU')} deposit.
            </p>

            <div className="space-y-3 mb-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.weeks}
                  plan={plan}
                  selected={selectedWeeks}
                  onSelect={setSelectedWeeks}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => goToStep('details')}
                className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePlanNext}
                disabled={!selectedWeeks}
                className="flex-1 h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step: Cash flow assessment */}
        {currentStepKey === 'assessment' && (
          <div>
            <h2 className="text-lg font-semibold text-navy mb-1">Cash Flow Analysis</h2>
            <p className="text-sm text-gray-500 mb-4">Based on your income and spending patterns.</p>

            {assessing ? (
              <div className="flex flex-col items-center py-12">
                <Loader2 className="w-10 h-10 text-coral-500 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Analyzing your cash flow...</p>
                <p className="text-sm text-gray-400">This usually takes a few seconds</p>
              </div>
            ) : assessment ? (
              <div>
                {/* Score */}
                <div className="bg-gray-50 rounded-xl p-5 mb-4 text-center">
                  <p className="text-sm text-gray-500 mb-1">LATR Score</p>
                  <p className={`text-4xl font-bold ${assessment.score >= 70 ? 'text-emerald-600' : assessment.score >= 40 ? 'text-amber-500' : 'text-red-500'}`}>
                    {assessment.score}
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${assessment.score >= 70 ? 'bg-emerald-500' : assessment.score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${assessment.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Factors */}
                <div className="space-y-2 mb-4">
                  {assessment.factors?.map((f) => (
                    <div key={f.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{f.label}</span>
                      <span className={`font-medium capitalize ${
                        f.rating === 'good' ? 'text-emerald-600' : f.rating === 'fair' ? 'text-yellow-600' : f.rating === 'neutral' ? 'text-gray-500' : 'text-red-500'
                      }`}>
                        {f.rating}
                      </span>
                    </div>
                  ))}
                </div>

                {assessment.approved ? (
                  <div className="bg-coral-50 rounded-xl p-5 mb-4 text-center">
                    <div className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-coral-600 mb-1">Deposit Aid: Approved!</p>
                    <p className="text-3xl font-bold text-navy mb-1">${numAmount.toLocaleString('en-AU')}</p>
                    <span className="text-sm font-medium text-coral-500 bg-coral-100 px-3 py-0.5 rounded-full">Funded</span>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-xl p-4 mb-4">
                    <p className="font-semibold text-red-700 mb-1">Not Approved</p>
                    <p className="text-sm text-red-600">
                      {assessment.reason || 'Unfortunately, we\'re unable to approve your deposit aid application at this time.'}
                      {' '}Consider a smaller deposit amount or a longer repayment term.
                    </p>
                  </div>
                )}

                {/* Summary */}
                {assessment.approved && selectedPlan && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Deposit amount</span>
                      <span className="text-navy font-semibold">${numAmount.toLocaleString('en-AU')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Plan</span>
                      <span className="text-navy font-medium">{selectedWeeks} weeks</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Weekly payment</span>
                      <span className="text-navy font-medium">${selectedPlan.weeklyPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-gray-500">Total repayment</span>
                      <span className="text-navy font-bold">${selectedPlan.totalRepayment.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep('plan')}
                    className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  {assessment.approved ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex-1 h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Confirm & Submit
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/deposit-aid"
                      className="flex-1 h-11 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      Back to Deposit Aid
                    </Link>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

const Field = forwardRef(function Field({ label, error, ...props }, ref) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        ref={ref}
        {...props}
        className="w-full h-11 px-4 rounded-xl border border-gray-300 text-navy focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  )
})
