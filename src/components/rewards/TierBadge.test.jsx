import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TierBadge from './TierBadge'

describe('TierBadge', () => {
  it('renders tier name capitalized', () => {
    render(<TierBadge tier="silver" />)
    expect(screen.getByText('silver')).toBeInTheDocument()
    // capitalize is applied via Tailwind class
    expect(screen.getByText('silver').className).toContain('capitalize')
  })

  it('applies silver colors by default', () => {
    render(<TierBadge />)
    const badge = screen.getByText('silver')
    expect(badge.className).toContain('bg-gray-100')
    expect(badge.className).toContain('text-gray-700')
  })

  it('applies gold colors', () => {
    render(<TierBadge tier="gold" />)
    const badge = screen.getByText('gold')
    expect(badge.className).toContain('bg-yellow-100')
    expect(badge.className).toContain('text-yellow-700')
  })

  it('applies platinum colors', () => {
    render(<TierBadge tier="platinum" />)
    const badge = screen.getByText('platinum')
    expect(badge.className).toContain('bg-purple-100')
    expect(badge.className).toContain('text-purple-700')
  })

  it('falls back to silver for unknown tier', () => {
    render(<TierBadge tier="diamond" />)
    const badge = screen.getByText('diamond')
    expect(badge.className).toContain('bg-gray-100')
  })

  it('renders small size by default', () => {
    render(<TierBadge tier="silver" />)
    const badge = screen.getByText('silver')
    expect(badge.className).toContain('text-xs')
    expect(badge.className).toContain('px-2')
  })

  it('renders large size', () => {
    render(<TierBadge tier="gold" size="lg" />)
    const badge = screen.getByText('gold')
    expect(badge.className).toContain('text-sm')
    expect(badge.className).toContain('px-3')
  })
})
