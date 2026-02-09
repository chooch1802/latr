import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calculator, ArrowRight } from 'lucide-react'
import { calculateAllPlans, PLANS } from '../lib/depositCalc'
import PlanCard from '../components/deposit/PlanCard'

export default function DepositCalculatorPage() {
  const [amount, setAmount] = useState('')
  const [selectedWeeks, setSelectedWeeks] = useState(null)

  const numAmount = Number(amount) || 0
  const plans = numAmount >= 1000 && numAmount <= 50000 ? calculateAllPlans(numAmount) : []

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/deposit-aid"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deposit Aid
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Deposit Calculator</h1>
          <p className="text-sm text-gray-500">See how much your weekly payments would be</p>
        </div>
      </div>

      {/* Amount input */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-700 mb-2">
          Deposit amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
          <input
            id="deposit-amount"
            type="number"
            min="1000"
            max="50000"
            step="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 2400"
            className="w-full h-12 pl-8 pr-4 rounded-xl border border-gray-300 text-navy font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Between $1,000 and $50,000</p>

        {numAmount > 0 && (numAmount < 1000 || numAmount > 50000) && (
          <p className="text-xs text-red-500 mt-1">
            {numAmount < 1000 ? 'Minimum deposit amount is $1,000' : 'Maximum deposit amount is $50,000'}
          </p>
        )}
      </div>

      {/* Plans */}
      {plans.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Choose a repayment plan</h2>
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

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 mb-6">
            <p>
              All plans include a one-time $200 setup fee. Interest rates range from 17–25% depending on
              deposit amount, with shorter plans receiving a 1.5% discount. No hidden fees. No early repayment penalties.
            </p>
          </div>

          {selectedWeeks && (
            <Link
              to="/deposit-aid/apply"
              className="flex items-center justify-center gap-2 w-full h-12 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors"
            >
              Apply for Deposit Aid
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </>
      )}

      {!amount && (
        <div className="text-center py-12 text-gray-400">
          <Calculator className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>Enter a deposit amount to see your payment options</p>
        </div>
      )}
    </div>
  )
}
