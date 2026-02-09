// Mock API services — replace with real integrations later

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// --- Airwallex KYC Mock ---
export async function submitKYCVerification({ userId, idDocumentUrl, selfieUrl, address }) {
  await delay(2000) // Simulate API latency
  // Always returns pending — in production, Airwallex webhook would update status
  return {
    status: 'pending',
    verificationId: `kyc_${userId}_${Date.now()}`,
    message: 'Your identity verification is being processed. This usually takes a few minutes.',
  }
}

export async function checkKYCStatus(verificationId) {
  await delay(800)
  // Mock: auto-approve for demo purposes
  return {
    status: 'approved',
    verificationId,
    verifiedAt: new Date().toISOString(),
  }
}

// --- Basiq Bank Connection Mock ---
export async function initiateBankConnection(userId) {
  await delay(1500)
  return {
    connectionId: `basiq_${userId}_${Date.now()}`,
    consentUrl: null, // In production, this would be the Basiq consent URL
    status: 'connected',
  }
}

export async function fetchBankAccounts(connectionId) {
  await delay(1000)
  return {
    accounts: [
      {
        id: 'acc_1',
        name: 'Everyday Account',
        institution: 'Commonwealth Bank',
        accountNumber: '****4521',
        balance: 4250.80,
        type: 'transaction',
      },
      {
        id: 'acc_2',
        name: 'Savings Account',
        institution: 'Commonwealth Bank',
        accountNumber: '****7832',
        balance: 12500.00,
        type: 'savings',
      },
    ],
  }
}

export async function fetchTransactions(accountId) {
  await delay(800)
  const now = new Date()
  return {
    transactions: [
      { id: 't1', date: daysAgo(now, 1), description: 'Woolworths', amount: -85.40, category: 'groceries' },
      { id: 't2', date: daysAgo(now, 2), description: 'Salary - Acme Corp', amount: 3200.00, category: 'income' },
      { id: 't3', date: daysAgo(now, 3), description: 'Netflix', amount: -16.99, category: 'entertainment' },
      { id: 't4', date: daysAgo(now, 5), description: 'Rent Payment', amount: -550.00, category: 'housing' },
      { id: 't5', date: daysAgo(now, 7), description: 'Uber', amount: -24.50, category: 'transport' },
      { id: 't6', date: daysAgo(now, 9), description: 'Salary - Acme Corp', amount: 3200.00, category: 'income' },
      { id: 't7', date: daysAgo(now, 10), description: 'Coles', amount: -62.30, category: 'groceries' },
      { id: 't8', date: daysAgo(now, 12), description: 'Electricity Bill', amount: -180.00, category: 'utilities' },
    ],
  }
}

function daysAgo(from, days) {
  const d = new Date(from)
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

// --- Airwallex Payout Mock ---
export async function createPayout({ amount, recipientName, recipientBsb, recipientAccount, description }) {
  await delay(2000)
  return {
    payoutId: `payout_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'processing',
    amount,
    recipientName,
    estimatedArrival: '1-2 business days',
  }
}

export async function checkPayoutStatus(payoutId) {
  await delay(800)
  return { payoutId, status: 'completed', completedAt: new Date().toISOString() }
}

// --- Cash Flow Underwriting (NO credit score) ---
// Philosophy: Approve based on ABILITY TO PAY, not credit history.
// Interest rate is based on deposit amount (17-25%), NOT risk tier. Tiers only set the credit limit.
export async function runCashFlowAssessment({ monthlyIncome, monthlyExpenses, bankBalance }) {
  await delay(2500)

  let score = 0
  const netCashFlow = monthlyIncome - monthlyExpenses

  // 1. INCOME STRENGTH (40 points max)
  if (monthlyIncome > 8000) score += 40
  else if (monthlyIncome > 5000) score += 30
  else if (monthlyIncome > 3000) score += 20
  else score += 10

  // 2. INCOME STABILITY (25 points max)
  // Mock: infer stability from income level (real impl uses deposit frequency)
  const incomeStability =
    monthlyIncome > 4000 ? 'very_stable' : monthlyIncome > 2000 ? 'stable' : 'irregular'
  if (incomeStability === 'very_stable') score += 25
  else if (incomeStability === 'stable') score += 20
  else if (incomeStability === 'irregular') score += 10
  else score += 5

  // 3. CASH FLOW MARGIN (20 points max)
  const margin = netCashFlow / (monthlyIncome || 1)
  if (margin > 0.4) score += 20
  else if (margin > 0.25) score += 15
  else if (margin > 0.15) score += 10
  else score += 5

  // 4. RENT PAYMENT HISTORY (10 points max)
  // Mock: assume good history if expenses include housing
  const rentHistory = monthlyExpenses >= 500 ? 'good' : 'none'
  if (rentHistory === 'perfect') score += 10
  else if (rentHistory === 'good') score += 7
  else if (rentHistory === 'fair') score += 5
  else score += 3 // No history = not penalized

  // 5. SAVINGS BUFFER (5 points max)
  if (bankBalance > 2000) score += 5
  else if (bankBalance > 1000) score += 3
  else score += 1

  // Clamp to 0-100
  score = Math.min(Math.max(score, 0), 100)

  // Determine tier & credit limit (interest is based on deposit amount, not risk tier)
  let tier, creditLimit, approved, reason

  if (score >= 70) {
    tier = 'A'
    creditLimit = 50000
    approved = true
    reason = 'Strong cash flow'
  } else if (score >= 55) {
    tier = 'B'
    creditLimit = 30000
    approved = true
    reason = 'Good income, manageable expenses'
  } else if (score >= 40) {
    tier = 'C'
    creditLimit = 15000
    approved = true
    reason = 'Adequate income to support repayment'
  } else {
    tier = null
    creditLimit = 0
    approved = false
    reason = 'Insufficient income to support repayment'
  }

  return {
    score,
    approved,
    tier,
    creditLimit,
    reason,
    monthlyIncome,
    monthlyExpenses,
    netCashFlow,
    factors: [
      { label: 'Income strength', rating: monthlyIncome > 5000 ? 'good' : monthlyIncome > 3000 ? 'fair' : 'low' },
      { label: 'Income stability', rating: incomeStability === 'very_stable' ? 'good' : incomeStability === 'stable' ? 'fair' : 'low' },
      { label: 'Cash flow margin', rating: margin > 0.3 ? 'good' : margin > 0.15 ? 'fair' : 'low' },
      { label: 'Rent payment history', rating: rentHistory === 'good' || rentHistory === 'perfect' ? 'good' : rentHistory === 'fair' ? 'fair' : 'neutral' },
      { label: 'Savings buffer', rating: bankBalance > 2000 ? 'good' : bankBalance > 1000 ? 'fair' : 'low' },
    ],
  }
}
