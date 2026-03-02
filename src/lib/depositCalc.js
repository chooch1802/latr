const SETUP_FEE = 0

const PLANS = [
  { weeks: 52, label: '52 weeks', description: 'Lowest interest, pay off faster', badge: 'Recommended', badgeColor: 'bg-coral-500 text-white' },
  { weeks: 78, label: '78 weeks', description: 'Balanced option', badge: null, badgeColor: '' },
  { weeks: 104, label: '104 weeks', description: 'Lowest weekly payment', badge: null, badgeColor: '' },
]

function getInterestRate(depositAmount, weeks) {
  // Tiered base rates (104-week reference)
  let baseRate
  if (depositAmount <= 5000) baseRate = 0.30
  else if (depositAmount <= 10000) baseRate = 0.27
  else if (depositAmount <= 20000) baseRate = 0.25
  else baseRate = 0.22

  // Plan duration adjustment: shorter terms = less interest
  if (weeks <= 52) baseRate -= 0.03
  else if (weeks <= 78) baseRate -= 0.015

  return baseRate
}

export function calculatePlan(depositAmount, weeks) {
  const amount = Number(depositAmount) || 0
  if (amount <= 0 || !weeks) return null

  const interestRate = getInterestRate(amount, weeks)
  const totalInterest = amount * interestRate
  const totalRepayment = amount + totalInterest + SETUP_FEE
  const weeklyPayment = totalRepayment / weeks

  return {
    depositAmount: amount,
    weeks,
    weeklyPayment: Math.ceil(weeklyPayment * 100) / 100,
    totalRepayment: Math.ceil(totalRepayment * 100) / 100,
    totalInterest: Math.ceil(totalInterest * 100) / 100,
    setupFee: SETUP_FEE,
    interestRate,
  }
}

export function calculateAllPlans(depositAmount) {
  return PLANS.map((plan) => ({
    ...plan,
    ...calculatePlan(depositAmount, plan.weeks),
  }))
}

export function generateRepaymentSchedule(depositAmount, weeks, startDate) {
  const plan = calculatePlan(depositAmount, weeks)
  if (!plan) return []

  const start = new Date(startDate)
  const schedule = []

  for (let i = 1; i <= weeks; i++) {
    const dueDate = new Date(start)
    dueDate.setDate(dueDate.getDate() + i * 7)
    schedule.push({
      weekNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      amount: plan.weeklyPayment,
      status: 'upcoming',
    })
  }

  return schedule
}

export { SETUP_FEE, PLANS, getInterestRate }
