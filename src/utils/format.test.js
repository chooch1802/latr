import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatCurrency, formatDate } from './format'

describe('formatCurrency', () => {
  it('formats positive amount with 2 decimals', () => {
    expect(formatCurrency(1234.5)).toBe('$1234.50')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats negative amount', () => {
    expect(formatCurrency(-50)).toBe('$-50.00')
  })

  it('formats with 0 decimal places', () => {
    const result = formatCurrency(1234.56, 0)
    // toLocaleString with 0 decimals rounds 1234.56 → 1,235
    expect(result).not.toContain('.')
    expect(result).toContain('1,235')
  })

  it('formats large numbers', () => {
    expect(formatCurrency(50000)).toBe('$50000.00')
  })

  it('returns $0.00 for non-numeric input', () => {
    expect(formatCurrency('abc')).toBe('$0.00')
    expect(formatCurrency(null)).toBe('$0.00')
    expect(formatCurrency(undefined)).toBe('$0.00')
  })

  it('handles string number input', () => {
    expect(formatCurrency('99.99')).toBe('$99.99')
  })

  it('respects custom decimal places', () => {
    expect(formatCurrency(10.456, 3)).toBe('$10.456')
  })
})

describe('formatDate', () => {
  it('returns "—" for null input', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('returns "—" for undefined input', () => {
    expect(formatDate(undefined)).toBe('—')
  })

  it('returns "—" for empty string', () => {
    expect(formatDate('')).toBe('—')
  })

  it('formats with short style (default)', () => {
    const result = formatDate('2025-06-15', 'short')
    // en-AU short: "15 Jun"
    expect(result).toContain('15')
    expect(result).toContain('Jun')
  })

  it('formats with long style', () => {
    const result = formatDate('2025-06-15', 'long')
    expect(result).toContain('15')
    expect(result).toContain('Jun')
    expect(result).toContain('2025')
  })

  describe('relative style', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-06-15T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns "just now" for < 1 minute ago', () => {
      const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString()
      expect(formatDate(thirtySecondsAgo, 'relative')).toBe('just now')
    })

    it('returns "Xm ago" for minutes', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      expect(formatDate(fiveMinAgo, 'relative')).toBe('5m ago')
    })

    it('returns "Xh ago" for hours', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      expect(formatDate(threeHoursAgo, 'relative')).toBe('3h ago')
    })

    it('returns "Xd ago" for days < 7', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      expect(formatDate(twoDaysAgo, 'relative')).toBe('2d ago')
    })

    it('falls back to date for >= 7 days', () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      const result = formatDate(tenDaysAgo, 'relative')
      // Should be a formatted date, not "Xd ago"
      expect(result).not.toContain('d ago')
      expect(result).toContain('Jun')
    })
  })

  it('uses default locale format for unknown style', () => {
    const result = formatDate('2025-06-15', 'unknown')
    // Should still return a valid date string
    expect(result).toBeTruthy()
    expect(result).not.toBe('—')
  })
})
