import { useState, useEffect } from 'react'
import { BarChart3, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { runAssessment as runServerAssessment } from '../../lib/basiqApi'

export default function CreditAssessmentStep({ onComplete }) {
  const { user } = useAuth()
  const [phase, setPhase] = useState('analyzing') // analyzing, result
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    runAssessment()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function runAssessment() {
    try {
      const assessment = await runServerAssessment()
      setResult(assessment)
      setPhase('result')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleComplete() {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          onboarding_step: 5,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
      if (updateError) throw updateError
      await onComplete()
    } catch (err) {
      setError(err.message)
    }
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
        <button
          onClick={() => { setError(null); setPhase('analyzing'); runAssessment() }}
          className="text-coral-500 font-semibold hover:text-coral-600 cursor-pointer"
        >
          Try again
        </button>
      </div>
    )
  }

  if (phase === 'analyzing') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-coral-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-coral-500 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">Analyzing Your Cash Flow</h2>
        <p className="text-gray-500 mb-6">We&apos;re reviewing your income and spending patterns...</p>
        <div className="max-w-xs mx-auto space-y-3">
          <AnalysisItem label="Reading transaction history" done />
          <AnalysisItem label="Calculating income patterns" done />
          <AnalysisItem label="Analyzing spending habits" />
          <AnalysisItem label="Computing affordability" />
        </div>
      </div>
    )
  }

  const scoreColor = result.score >= 70 ? 'text-emerald-500' : result.score >= 40 ? 'text-amber-500' : 'text-red-500'
  const scoreBarColor = result.score >= 70 ? 'bg-emerald-500' : result.score >= 40 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-coral-50 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-coral-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy">Cash Flow Analysis</h2>
          <p className="text-sm text-gray-500">Based on your income and spending</p>
        </div>
      </div>

      {/* Score */}
      <div className="text-center mb-6 p-6 bg-gray-50 rounded-2xl">
        <p className="text-sm text-gray-500 mb-1">Your LATR Score</p>
        <p className={`text-5xl font-bold ${scoreColor}`}>{result.score}</p>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${scoreBarColor}`}
            style={{ width: `${result.score}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {/* Approval status */}
      <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
        result.approved ? 'bg-emerald-50' : 'bg-red-50'
      }`}>
        {result.approved ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500 shrink-0" />
        )}
        <div>
          <p className={`font-semibold ${result.approved ? 'text-emerald-700' : 'text-red-700'}`}>
            {result.approved ? 'Pre-approved!' : 'Not approved at this time'}
          </p>
          {result.approved && (
            <p className="text-sm text-emerald-600">
              Approved limit: up to ${result.creditLimit.toLocaleString('en-AU')}
            </p>
          )}
          {!result.approved && result.reason && (
            <p className="text-sm text-red-600">{result.reason}</p>
          )}
        </div>
      </div>

      {/* Financial summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Monthly Income</p>
          <p className="text-sm font-bold text-navy">${result.monthlyIncome.toLocaleString('en-AU')}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Monthly Expenses</p>
          <p className="text-sm font-bold text-navy">${result.monthlyExpenses.toLocaleString('en-AU')}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500 mb-1">Net Cash Flow</p>
          <p className="text-sm font-bold text-emerald-600">${result.netCashFlow.toLocaleString('en-AU')}</p>
        </div>
      </div>

      {/* Factors */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Assessment Factors</h3>
        <div className="space-y-2">
          {result.factors.map((factor) => (
            <div key={factor.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-700">{factor.label}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                factor.rating === 'good'
                  ? 'bg-emerald-100 text-emerald-700'
                  : factor.rating === 'fair'
                    ? 'bg-amber-100 text-amber-700'
                    : factor.rating === 'neutral'
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-red-100 text-red-700'
              }`}>
                {factor.rating.charAt(0).toUpperCase() + factor.rating.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleComplete}
        className="w-full h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 cursor-pointer inline-flex items-center justify-center gap-2"
      >
        Go to Dashboard <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function AnalysisItem({ label, done }) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
      ) : (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-coral-500 rounded-full animate-spin shrink-0" />
      )}
      <span className={`text-sm ${done ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}
