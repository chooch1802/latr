import { useState, forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import { businessVerificationSchema } from '../../lib/validations'
import { verifyBusiness } from '../../lib/businessApi'

const LAYER_LABELS = {
  abn: 'ABN Lookup',
  asic: 'ASIC Director Verification',
  equifax: 'Equifax Commercial Credit',
  creditorwatch: 'CreditorWatch Risk Assessment',
}

function LayerStatusIcon({ status }) {
  if (status === 'passed') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
  if (status === 'failed') return <XCircle className="w-5 h-5 text-red-500" />
  if (status === 'error') return <AlertTriangle className="w-5 h-5 text-amber-500" />
  return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
}

function LayerStatusBadge({ status }) {
  const styles = {
    passed: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-red-100 text-red-700',
    error: 'bg-amber-100 text-amber-700',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${styles[status] || 'bg-gray-100 text-gray-500'}`}>
      {status}
    </span>
  )
}

export default function BusinessVerificationStep({ depositApplicationId, onEnsureDepositApp, onComplete, onBack }) {
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const form = useForm({
    resolver: zodResolver(businessVerificationSchema),
    defaultValues: {
      abn: '',
      acn: '',
      businessName: '',
      applicantRole: '',
    },
  })

  async function handleVerify(formData) {
    setVerifying(true)
    setError(null)
    try {
      // Ensure deposit application exists (created lazily for business flow)
      const appId = depositApplicationId || (onEnsureDepositApp ? await onEnsureDepositApp() : null)
      if (!appId) throw new Error('Could not create deposit application')

      const res = await verifyBusiness({
        depositApplicationId: appId,
        abn: formData.abn,
        acn: formData.acn || undefined,
        businessName: formData.businessName,
        applicantRole: formData.applicantRole,
      })
      setResult(res)
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const canContinue = result && (result.overallStatus === 'passed' || result.overallStatus === 'partial')

  // ─── Results state ───
  if (result) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-navy mb-1">Business Verification</h2>
        <p className="text-sm text-gray-500 mb-5">
          {result.overallStatus === 'passed'
            ? 'All checks passed. Your business has been verified.'
            : result.overallStatus === 'partial'
              ? 'Partial verification. An admin will review your application.'
              : 'Verification failed. See details below.'}
        </p>

        {/* Overall score bar */}
        <div className="bg-gray-50 rounded-xl p-5 mb-5 text-center">
          <p className="text-sm text-gray-500 mb-1">Business Verification Score</p>
          <p className={`text-4xl font-bold ${
            result.overallScore >= 70 ? 'text-emerald-600' :
            result.overallScore >= 50 ? 'text-amber-500' :
            'text-red-500'
          }`}>
            {result.overallScore}
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                result.overallScore >= 70 ? 'bg-emerald-500' :
                result.overallScore >= 50 ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              style={{ width: `${result.overallScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>100</span>
          </div>
          <div className="mt-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              result.overallStatus === 'passed' ? 'bg-emerald-100 text-emerald-700' :
              result.overallStatus === 'partial' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {result.overallStatus === 'partial' ? 'Needs Review' : result.overallStatus}
            </span>
          </div>
        </div>

        {/* Layer results */}
        <div className="space-y-3 mb-5">
          {Object.entries(LAYER_LABELS).map(([key, label]) => {
            const layer = result.layers?.[key]
            if (!layer) return null
            return (
              <div key={key} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <LayerStatusIcon status={layer.status} />
                  <span className="text-sm font-medium text-navy">{label}</span>
                </div>
                <LayerStatusBadge status={layer.status} />
              </div>
            )
          })}
        </div>

        {/* Failure reasons */}
        {result.failureReasons?.length > 0 && (
          <div className="bg-red-50 rounded-xl p-4 mb-5">
            <p className="text-sm font-semibold text-red-700 mb-1">Issues Found</p>
            <ul className="text-sm text-red-600 space-y-1">
              {result.failureReasons.map((reason, i) => (
                <li key={i}>&bull; {reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{result.layersPassed}</p>
            <p className="text-xs text-emerald-700 font-medium">Passed</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{result.layersFailed}</p>
            <p className="text-xs text-red-700 font-medium">Failed</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{result.layersError}</p>
            <p className="text-xs text-amber-700 font-medium">Errors</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back
          </button>
          {canContinue ? (
            <button
              type="button"
              onClick={() => onComplete(result)}
              className="flex-1 h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setResult(null); setError(null) }}
              className="flex-1 h-11 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  // ─── Form state ───
  return (
    <div>
      <h2 className="text-lg font-semibold text-navy mb-1">Business Verification</h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter your business details. We'll verify the ABN, company registration, and commercial credit.
      </p>

      {error && (
        <div className="bg-red-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleVerify)}>
        <Field label="ABN (11 digits)" placeholder="12345678901" error={form.formState.errors.abn} {...form.register('abn')} />

        <Field label="ACN (9 digits, optional)" placeholder="123456789" error={form.formState.errors.acn} {...form.register('acn')} />

        <Field label="Business name" error={form.formState.errors.businessName} {...form.register('businessName')} />

        {/* Role selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your role</label>
          <div className="flex gap-3">
            {[
              { value: 'director', label: 'Director' },
              { value: 'authorized_representative', label: 'Authorised Rep' },
            ].map((role) => (
              <label
                key={role.value}
                className={`flex-1 flex items-center justify-center h-11 rounded-xl border-2 text-sm font-medium cursor-pointer transition-all ${
                  form.watch('applicantRole') === role.value
                    ? 'border-coral-500 bg-coral-50 text-coral-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input type="radio" value={role.value} {...form.register('applicantRole')} className="sr-only" />
                <span>{role.label}</span>
              </label>
            ))}
          </div>
          {form.formState.errors.applicantRole && (
            <p className="text-xs text-red-500 mt-1">{form.formState.errors.applicantRole.message}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={verifying}
            className="flex-1 h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying Business...
              </>
            ) : (
              'Verify Business'
            )}
          </button>
        </div>
      </form>
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
