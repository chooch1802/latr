import { describe, it, expect } from 'vitest'
import { calculateRoundup, generateMockTransactions, estimateMonthlyRoundup } from './roundupCalc'

describe('calculateRoundup', () => {
  it('rounds $4.30 to nearest $1 = $0.70', () => {
    expect(calculateRoundup(4.30, 1)).toBeCloseTo(0.70)
  })

  it('rounds $4.30 to nearest $2 = $1.70', () => {
    expect(calculateRoundup(4.30, 2)).toBeCloseTo(1.70)
  })

  it('rounds $4.30 to nearest $5 = $0.70', () => {
    expect(calculateRoundup(4.30, 5)).toBeCloseTo(0.70)
  })

  it('returns 0 for exact multiples', () => {
    expect(calculateRoundup(5.00, 1)).toBe(0)
    expect(calculateRoundup(10.00, 2)).toBe(0)
    expect(calculateRoundup(15.00, 5)).toBe(0)
  })

  it('returns 0 for zero amount', () => {
    expect(calculateRoundup(0, 1)).toBe(0)
  })

  it('returns 0 for negative amount', () => {
    expect(calculateRoundup(-5.50, 1)).toBe(0)
  })

  it('returns 0 for negative roundTo', () => {
    expect(calculateRoundup(5.50, -1)).toBe(0)
  })

  it('returns 0 for zero roundTo', () => {
    expect(calculateRoundup(5.50, 0)).toBe(0)
  })

  it('handles small amounts correctly', () => {
    expect(calculateRoundup(0.10, 1)).toBeCloseTo(0.90)
  })

  it('rounds $7.50 to nearest $5 = $2.50', () => {
    expect(calculateRoundup(7.50, 5)).toBeCloseTo(2.50)
  })

  it('rounds $99.01 to nearest $1 = $0.99', () => {
    expect(calculateRoundup(99.01, 1)).toBeCloseTo(0.99)
  })

  it('avoids floating point issues (returns clean cents)', () => {
    const result = calculateRoundup(4.30, 1)
    // Should be exactly 0.7, not 0.7000000000000004
    expect(result).toBe(0.70)
  })
})

describe('estimateMonthlyRoundup', () => {
  it('returns correct estimates for $1 rounding', () => {
    const est = estimateMonthlyRoundup(1)
    expect(est.monthly).toBe(30) // 0.50 * 60
    expect(est.weekly).toBeCloseTo(6.93, 1)
    expect(est.yearly).toBe(360)
  })

  it('returns correct estimates for $2 rounding', () => {
    const est = estimateMonthlyRoundup(2)
    expect(est.monthly).toBe(60) // 1.00 * 60
    expect(est.yearly).toBe(720)
  })

  it('returns correct estimates for $5 rounding', () => {
    const est = estimateMonthlyRoundup(5)
    expect(est.monthly).toBe(150) // 2.50 * 60
    expect(est.yearly).toBe(1800)
  })

  it('falls back to $0.50 avg for unknown roundTo', () => {
    const est = estimateMonthlyRoundup(10)
    expect(est.monthly).toBe(30) // 0.50 * 60 fallback
  })

  it('weekly is approximately monthly / 4.33', () => {
    const est = estimateMonthlyRoundup(1)
    expect(est.weekly).toBeCloseTo(est.monthly / 4.33, 1)
  })
})

describe('generateMockTransactions', () => {
  it('generates the requested number of transactions', () => {
    const txns = generateMockTransactions(10)
    expect(txns).toHaveLength(10)
  })

  it('defaults to 15 transactions', () => {
    const txns = generateMockTransactions()
    expect(txns).toHaveLength(15)
  })

  it('sorts transactions by date descending', () => {
    const txns = generateMockTransactions(20)
    for (let i = 1; i < txns.length; i++) {
      expect(new Date(txns[i - 1].transaction_date) >= new Date(txns[i].transaction_date)).toBe(true)
    }
  })

  it('each transaction has required fields', () => {
    const txns = generateMockTransactions(5)
    txns.forEach((txn) => {
      expect(txn).toHaveProperty('merchant_name')
      expect(txn).toHaveProperty('category')
      expect(txn).toHaveProperty('original_amount')
      expect(txn).toHaveProperty('transaction_date')
      expect(typeof txn.merchant_name).toBe('string')
      expect(typeof txn.original_amount).toBe('number')
      expect(txn.original_amount).toBeGreaterThan(0)
    })
  })

  it('transaction dates are within the specified range', () => {
    const daysBack = 7
    const txns = generateMockTransactions(20, daysBack)
    const now = new Date()
    const earliest = new Date(now)
    earliest.setDate(earliest.getDate() - daysBack)

    txns.forEach((txn) => {
      const date = new Date(txn.transaction_date)
      expect(date <= now).toBe(true)
      // Allow 1 day buffer for timezone differences
      const buffer = new Date(earliest)
      buffer.setDate(buffer.getDate() - 1)
      expect(date >= buffer).toBe(true)
    })
  })
})
