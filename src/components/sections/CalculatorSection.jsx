import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ArrowDown } from 'lucide-react'
import { clsx } from 'clsx'
import { fadeInUp } from '../../utils/animations'
import { calculateRepayment, paymentPlans } from '../../utils/constants'

export default function CalculatorSection() {
  const [depositAmount, setDepositAmount] = useState(4000)
  const [selectedPlan, setSelectedPlan] = useState(52)

  const calculations = useMemo(
    () => paymentPlans.map((plan) => calculateRepayment(depositAmount || 0, plan.weeks)),
    [depositAmount]
  )

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setDepositAmount(val === '' ? 0 : parseInt(val, 10))
  }

  return (
    <section id="calculator" className="bg-white py-20 md:py-30" aria-labelledby="calculator-heading">
      <div className="max-w-[1280px] mx-auto px-6 md:px-20">
        {/* Section heading */}
        <motion.p
          {...fadeInUp}
          className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-coral-400 mb-4"
        >
          Deposit Aid
        </motion.p>

        <motion.h2
          {...fadeInUp}
          id="calculator-heading"
          className="text-3xl sm:text-4xl md:text-[56px] font-bold text-coral-500 text-center leading-tight tracking-tight mb-4"
        >
          Calculate your<br />deposit
        </motion.h2>

        <motion.p {...fadeInUp} className="text-lg md:text-xl text-gray-500 text-center mb-12 md:mb-16">
          See your weekly repayment options
        </motion.p>

        {/* Calculator Interface */}
        <motion.div {...fadeInUp} className="max-w-[900px] mx-auto">
          {/* Input */}
          <div className="flex flex-col items-center mb-8">
            <label htmlFor="deposit-input" className="text-base font-medium text-gray-500 mb-2">
              Property deposit
            </label>
            <div className="relative w-full max-w-[400px]">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400">$</span>
              <input
                id="deposit-input"
                type="text"
                inputMode="numeric"
                value={depositAmount === 0 ? '' : depositAmount.toLocaleString()}
                onChange={handleAmountChange}
                placeholder="4,000"
                className="w-full bg-gray-100 rounded-xl px-5 pl-12 py-5 text-3xl font-bold text-gray-900 border-2 border-transparent focus:border-coral-500 focus:outline-none transition-colors"
                aria-label="Deposit amount in dollars"
                data-testid="deposit-input"
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-8">
            <div className="w-10 h-10 rounded-full bg-coral-50 flex items-center justify-center">
              <ArrowDown className="w-5 h-5 text-coral-500" />
            </div>
          </div>

          {/* Payment Plan Cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            role="tablist"
            aria-label="Payment plan options"
          >
            {paymentPlans.map((plan, index) => {
              const calc = calculations[index]
              const isSelected = selectedPlan === plan.weeks

              return (
                <motion.button
                  key={plan.weeks}
                  whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(255,90,61,0.15)' }}
                  onClick={() => setSelectedPlan(plan.weeks)}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`plan-${plan.weeks}`}
                  className={clsx(
                    'relative rounded-2xl p-8 border-2 text-left transition-all duration-300 cursor-pointer',
                    isSelected
                      ? 'border-coral-500 bg-coral-50 shadow-coral'
                      : 'border-gray-200 bg-white shadow-soft hover:border-coral-300'
                  )}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 right-4 bg-coral-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.label}
                    </span>
                  )}

                  <div className="mb-4" id={`plan-${plan.weeks}`}>
                    <span className="text-4xl md:text-5xl font-extrabold text-gray-900" data-testid="weekly-amount">
                      ${calc.weeklyAmount}
                    </span>
                    <span className="text-base font-normal text-gray-500">/week</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 mb-6">
                    <Calendar className="w-4 h-4" />
                    <span className="text-base font-medium">{plan.weeks} weeks</span>
                  </div>

                  <div
                    className={clsx(
                      'w-full text-center py-3 rounded-xl font-semibold text-base transition-all',
                      isSelected
                        ? 'bg-coral-500 text-white'
                        : 'border-2 border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white'
                    )}
                  >
                    {isSelected ? 'Selected' : 'Select plan'}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Fine print */}
          <p
            className="text-sm text-gray-400 text-center mt-8"
            aria-live="polite"
            aria-atomic="true"
          >
            Interest rates from 17–25% depending on deposit amount. No setup fees. LATR pays your landlord or agency directly. Total repayment: ${calculations.find((c) => c.weeks === selectedPlan)?.totalPaid || '0'}. Max $50,000.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
