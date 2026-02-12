const SETUP_FEE = 200

const PLANS = [
  { weeks: 104, label: '104 weeks', description: 'Lowest weekly payment', badge: 'Lowest', badgeColor: 'bg-navy text-white' },
  { weeks: 78, label: '78 weeks', description: 'Balanced option', badge: 'Recommended', badgeColor: 'bg-coral-500 text-white' },
  { weeks: 52, label: '52 weeks', description: 'Pay off faster', badge: 'Fastest', badgeColor: 'bg-emerald-500 text-white' },
]

function getInterestRate(depositAmount, weeks) {
  // Tiered base rates (104-week reference)
  let baseRate
  if (depositAmount <= 5000) baseRate = 0.25
  else if (depositAmount <= 10000) baseRate = 0.22
  else if (depositAmount <= 20000) baseRate = 0.20
  else baseRate = 0.17

  // Plan duration adjustment: ±1.5% from 104-week base
  if (weeks > 104) baseRate += 0.015
  else if (weeks < 104) baseRate -= 0.015

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
