import { describe, it, expect } from 'vitest'
import {
  calculatePlan,
  calculateAllPlans,
  generateRepaymentSchedule,
  getInterestRate,
  SETUP_FEE,
  PLANS,
} from './depositCalc'

describe('getInterestRate', () => {
  it('returns 30% base for deposits <= $5000 at 104 weeks', () => {
    expect(getInterestRate(3000, 104)).toBe(0.30)
    expect(getInterestRate(5000, 104)).toBe(0.30)
  })

  it('returns 27% base for deposits $5001–$10000 at 104 weeks', () => {
    expect(getInterestRate(8000, 104)).toBe(0.27)
    expect(getInterestRate(10000, 104)).toBe(0.27)
  })

  it('returns 25% base for deposits $10001–$20000 at 104 weeks', () => {
    expect(getInterestRate(15000, 104)).toBe(0.25)
    expect(getInterestRate(20000, 104)).toBe(0.25)
  })

  it('returns 22% base for deposits > $20000 at 104 weeks', () => {
    expect(getInterestRate(25000, 104)).toBe(0.22)
    expect(getInterestRate(50000, 104)).toBe(0.22)
  })

  it('applies -3% adjustment for 52-week plans', () => {
    expect(getInterestRate(3000, 52)).toBeCloseTo(0.27)
    expect(getInterestRate(8000, 52)).toBeCloseTo(0.24)
    expect(getInterestRate(15000, 52)).toBeCloseTo(0.22)
    expect(getInterestRate(25000, 52)).toBeCloseTo(0.19)
  })

  it('applies -1.5% adjustment for 78-week plans', () => {
    expect(getInterestRate(3000, 78)).toBe(0.285)
    expect(getInterestRate(8000, 78)).toBe(0.255)
  })

  it('handles boundary at exactly $5000', () => {
    expect(getInterestRate(5000, 104)).toBe(0.30)
    expect(getInterestRate(5001, 104)).toBe(0.27)
  })

  it('handles boundary at exactly $10000', () => {
    expect(getInterestRate(10000, 104)).toBe(0.27)
    expect(getInterestRate(10001, 104)).toBe(0.25)
  })

  it('handles boundary at exactly $20000', () => {
    expect(getInterestRate(20000, 104)).toBe(0.25)
    expect(getInterestRate(20001, 104)).toBe(0.22)
  })
})

describe('calculatePlan', () => {
  it('returns null for zero deposit', () => {
    expect(calculatePlan(0, 52)).toBeNull()
  })

  it('returns null for negative deposit', () => {
    expect(calculatePlan(-1000, 52)).toBeNull()
  })

  it('returns null for missing weeks', () => {
    expect(calculatePlan(5000, 0)).toBeNull()
    expect(calculatePlan(5000, null)).toBeNull()
    expect(calculatePlan(5000, undefined)).toBeNull()
  })

  it('returns null for non-numeric deposit', () => {
    expect(calculatePlan('abc', 52)).toBeNull()
  })

  it('converts string deposit to number', () => {
    const plan = calculatePlan('5000', 52)
    expect(plan).not.toBeNull()
    expect(plan.depositAmount).toBe(5000)
  })

  it('calculates correct total interest', () => {
    // $3000 at 52 weeks: rate = 0.30 - 0.03 = 0.27
    const plan = calculatePlan(3000, 52)
    expect(plan.interestRate).toBe(0.27)
    expect(plan.totalInterest).toBe(Math.ceil(3000 * 0.27 * 100) / 100)
  })

  it('calculates correct total repayment', () => {
    const plan = calculatePlan(3000, 52)
    expect(plan.totalRepayment).toBe(
      Math.ceil((3000 + 3000 * 0.27 + SETUP_FEE) * 100) / 100
    )
  })

  it('uses ceil rounding for weekly payment', () => {
    const plan = calculatePlan(3000, 52)
    const rawWeekly = (3000 + 3000 * 0.27) / 52
    expect(plan.weeklyPayment).toBe(Math.ceil(rawWeekly * 100) / 100)
  })

  it('includes all expected fields', () => {
    const plan = calculatePlan(10000, 104)
    expect(plan).toHaveProperty('depositAmount')
    expect(plan).toHaveProperty('weeks')
    expect(plan).toHaveProperty('weeklyPayment')
    expect(plan).toHaveProperty('totalRepayment')
    expect(plan).toHaveProperty('totalInterest')
    expect(plan).toHaveProperty('setupFee')
    expect(plan).toHaveProperty('interestRate')
  })

  it('sets setupFee to SETUP_FEE constant', () => {
    const plan = calculatePlan(10000, 52)
    expect(plan.setupFee).toBe(SETUP_FEE)
  })

  it('applies tiered rates correctly for $8k at 52wk', () => {
    const plan = calculatePlan(8000, 52)
    // 27% base - 3% = 24%
    expect(plan.interestRate).toBeCloseTo(0.24)
  })

  it('applies tiered rates correctly for $15k at 78wk', () => {
    const plan = calculatePlan(15000, 78)
    // 25% base - 1.5% = 23.5%
    expect(plan.interestRate).toBe(0.235)
  })

  it('applies tiered rates correctly for $25k at 104wk', () => {
    const plan = calculatePlan(25000, 104)
    expect(plan.interestRate).toBe(0.22)
  })
})

describe('calculateAllPlans', () => {
  it('returns exactly 3 plans', () => {
    const plans = calculateAllPlans(10000)
    expect(plans).toHaveLength(3)
  })

  it('returns plans for 52, 78, and 104 weeks', () => {
    const plans = calculateAllPlans(10000)
    expect(plans[0].weeks).toBe(52)
    expect(plans[1].weeks).toBe(78)
    expect(plans[2].weeks).toBe(104)
  })

  it('includes plan metadata (label, description, badge)', () => {
    const plans = calculateAllPlans(10000)
    expect(plans[0].label).toBe('52 weeks')
    expect(plans[0].badge).toBe('Recommended')
    expect(plans[1].badge).toBeNull()
  })

  it('handles zero deposit without errors', () => {
    const plans = calculateAllPlans(0)
    expect(plans).toHaveLength(3)
    // Each plan should still have metadata but null calc fields
    plans.forEach((p) => {
      expect(p.weeklyPayment).toBeUndefined()
    })
  })
})

describe('generateRepaymentSchedule', () => {
  it('returns correct number of entries', () => {
    const schedule = generateRepaymentSchedule(5000, 52, '2025-01-01')
    expect(schedule).toHaveLength(52)
  })

  it('returns empty array for invalid deposit', () => {
    expect(generateRepaymentSchedule(0, 52, '2025-01-01')).toEqual([])
    expect(generateRepaymentSchedule(-100, 52, '2025-01-01')).toEqual([])
  })

  it('has 7-day intervals between entries', () => {
    const schedule = generateRepaymentSchedule(5000, 4, '2025-01-01')
    for (let i = 1; i < schedule.length; i++) {
      const prev = new Date(schedule[i - 1].dueDate)
      const curr = new Date(schedule[i].dueDate)
      const diff = (curr - prev) / (1000 * 60 * 60 * 24)
      expect(diff).toBe(7)
    }
  })

  it('first entry is 7 days after start date', () => {
    const schedule = generateRepaymentSchedule(5000, 4, '2025-01-01')
    expect(schedule[0].dueDate).toBe('2025-01-08')
  })

  it('each entry has weekNumber, dueDate, amount, status', () => {
    const schedule = generateRepaymentSchedule(5000, 4, '2025-01-01')
    schedule.forEach((entry, i) => {
      expect(entry.weekNumber).toBe(i + 1)
      expect(entry.dueDate).toBeDefined()
      expect(entry.amount).toBeGreaterThan(0)
      expect(entry.status).toBe('upcoming')
    })
  })
})
