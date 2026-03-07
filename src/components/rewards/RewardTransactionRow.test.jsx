import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RewardTransactionRow from './RewardTransactionRow'

function renderRow(overrides = {}) {
  const transaction = {
    id: 't1',
    category: 'repayment_ontime',
    points: 100,
    description: 'On-time repayment bonus',
    created_at: '2025-06-15T10:00:00Z',
    multiplier: 1,
    ...overrides,
  }
  return render(<RewardTransactionRow transaction={transaction} />)
}

describe('RewardTransactionRow', () => {
  it('renders description text', () => {
    renderRow({ description: 'Weekly repayment' })
    expect(screen.getByText('Weekly repayment')).toBeInTheDocument()
  })

  it('falls back to formatted category when no description', () => {
    renderRow({ description: null, category: 'rent_day_bonus' })
    expect(screen.getByText('rent day bonus')).toBeInTheDocument()
  })

  it('shows positive points with "+" prefix and green color', () => {
    renderRow({ points: 250 })
    const pointsEl = screen.getByText('+250')
    expect(pointsEl).toBeInTheDocument()
    expect(pointsEl.className).toContain('text-emerald-600')
  })

  it('shows negative points with red color (no "+" prefix)', () => {
    renderRow({ points: -500, category: 'redemption_gift_card', description: 'Gift card redemption' })
    const pointsEl = screen.getByText('-500')
    expect(pointsEl).toBeInTheDocument()
    expect(pointsEl.className).toContain('text-red-500')
  })

  it('displays formatted date', () => {
    renderRow({ created_at: '2025-06-15T10:00:00Z' })
    // en-AU format: "15 June 2025" (happy-dom uses long month name)
    expect(screen.getByText(/15 June 2025/)).toBeInTheDocument()
  })

  it('shows multiplier when > 1', () => {
    renderRow({ multiplier: 3 })
    expect(screen.getByText(/3x/)).toBeInTheDocument()
  })

  it('does not show multiplier when 1', () => {
    renderRow({ multiplier: 1 })
    expect(screen.queryByText(/1x/)).not.toBeInTheDocument()
  })

  it('formats large point values with locale', () => {
    renderRow({ points: 10000 })
    expect(screen.getByText('+10,000')).toBeInTheDocument()
  })
})
