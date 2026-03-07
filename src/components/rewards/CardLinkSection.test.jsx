import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock fidelApi before importing component
const mockGetLinkedCards = vi.fn()
const mockLinkCard = vi.fn()
const mockUnlinkCard = vi.fn()

vi.mock('../../lib/fidelApi', () => ({
  getLinkedCards: (...args) => mockGetLinkedCards(...args),
  linkCard: (...args) => mockLinkCard(...args),
  unlinkCard: (...args) => mockUnlinkCard(...args),
}))

import CardLinkSection from './CardLinkSection'

beforeEach(() => {
  vi.clearAllMocks()
  delete window.Fidel
})

describe('CardLinkSection', () => {
  it('shows loading skeleton initially', () => {
    mockGetLinkedCards.mockReturnValue(new Promise(() => {})) // never resolves
    const { container } = render(<CardLinkSection />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders empty state when no cards', async () => {
    mockGetLinkedCards.mockResolvedValue([])

    render(<CardLinkSection />)

    await waitFor(() => {
      expect(screen.getByText('Link a card to earn points automatically')).toBeInTheDocument()
    })
  })

  it('renders card list with scheme and last four', async () => {
    mockGetLinkedCards.mockResolvedValue([
      { id: '1', fidel_card_id: 'fc1', scheme: 'visa', last_four: '4242', exp_month: 12, exp_year: 2027 },
      { id: '2', fidel_card_id: 'fc2', scheme: 'mastercard', last_four: '5555', exp_month: 6, exp_year: 2026 },
    ])

    render(<CardLinkSection />)

    await waitFor(() => {
      expect(screen.getByText('Visa')).toBeInTheDocument()
      expect(screen.getByText('****4242')).toBeInTheDocument()
      expect(screen.getByText('MC')).toBeInTheDocument()
      expect(screen.getByText('****5555')).toBeInTheDocument()
    })
  })

  it('displays formatted expiry date', async () => {
    mockGetLinkedCards.mockResolvedValue([
      { id: '1', fidel_card_id: 'fc1', scheme: 'visa', last_four: '4242', exp_month: 3, exp_year: 2027 },
    ])

    render(<CardLinkSection />)

    await waitFor(() => {
      expect(screen.getByText('Exp 03/2027')).toBeInTheDocument()
    })
  })

  it('Link Card button calls Fidel SDK openForm', async () => {
    mockGetLinkedCards.mockResolvedValue([])
    const mockOpenForm = vi.fn()
    window.Fidel = { openForm: mockOpenForm }

    render(<CardLinkSection />)

    await waitFor(() => {
      expect(screen.getByText('Link Card')).toBeInTheDocument()
    })

    const user = userEvent.setup()
    await user.click(screen.getByText('Link Card'))

    expect(mockOpenForm).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: 'LATR',
      })
    )
  })

  it('shows Fidel security notice', async () => {
    mockGetLinkedCards.mockResolvedValue([])
    render(<CardLinkSection />)

    await waitFor(() => {
      expect(
        screen.getByText(/securely stored and tokenized by Fidel/)
      ).toBeInTheDocument()
    })
  })
})
