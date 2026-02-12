export const sampleProperties = [
  {
    id: 1,
    title: 'All accounts',
    type: 'summary',
    amount: 4224,
    period: 'month',
    icon: 'globe',
  },
  {
    id: 2,
    title: 'Sydney CBD',
    type: 'apartment',
    amount: 3414,
    period: 'month',
    address: '123 George St, Sydney NSW 2000',
    bedrooms: 2,
    bathrooms: 2,
    flag: 'AU',
  },
  {
    id: 3,
    title: 'Brisbane Unit',
    type: 'unit',
    amount: 532,
    period: 'week',
    address: '45 Queen St, Brisbane QLD 4000',
    bedrooms: 1,
    bathrooms: 1,
    flag: 'AU',
  },
  {
    id: 4,
    title: 'Melbourne Warehouse',
    type: 'commercial',
    amount: 1326,
    period: 'week',
    address: '789 Flinders St, Melbourne VIC 3000',
    sqm: 250,
    flag: 'AU',
  },
]

export const calculateRepayment = (depositAmount, weeks) => {
  // Tiered base rates (104-week reference)
  let baseRate
  if (depositAmount <= 5000) baseRate = 0.25
  else if (depositAmount <= 10000) baseRate = 0.22
  else if (depositAmount <= 20000) baseRate = 0.20
  else baseRate = 0.17

  // Plan duration adjustment: ±1.5% from 104-week base
  if (weeks > 104) baseRate += 0.015
  else if (weeks < 104) baseRate -= 0.015

  const totalInterest = depositAmount * baseRate
  const totalWithInterest = depositAmount + totalInterest
  const weeklyAmount = totalWithInterest / weeks

  return {
    weeklyAmount: weeklyAmount.toFixed(2),
    totalPaid: totalWithInterest.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    interestRate: baseRate,
    weeks,
  }
}

export const paymentPlans = [
  { weeks: 104, label: 'Lowest' },
  { weeks: 78, label: 'Balanced' },
  { weeks: 52, label: 'Most Popular', badge: true },
]

export const sampleTransactions = [
  {
    id: 1,
    type: 'rent_due',
    title: 'Rent Due in 5 Days',
    amount: -1250,
    date: '2026-02-13',
    status: 'pending',
    icon: 'calendar',
  },
  {
    id: 2,
    type: 'deposit_approved',
    title: 'Deposit Approved',
    amount: 4000,
    date: '2026-02-08',
    status: 'completed',
    icon: 'check-circle',
  },
  {
    id: 3,
    type: 'bill_split',
    title: 'Bill Split: Electricity',
    amount: -120,
    date: '2026-02-05',
    status: 'completed',
    icon: 'zap',
  },
]
