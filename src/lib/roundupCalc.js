/**
 * Round Up calculation and simulation utilities.
 * Generates mock Australian merchant transactions for MVP demo.
 * Structured for easy swap-in of real bank data (Basiq) later.
 */

const AU_MERCHANTS = [
  { name: 'Woolworths', category: 'Groceries' },
  { name: 'Coles', category: 'Groceries' },
  { name: 'ALDI', category: 'Groceries' },
  { name: 'IGA', category: 'Groceries' },
  { name: 'Shell', category: 'Fuel' },
  { name: 'BP', category: 'Fuel' },
  { name: 'Ampol', category: 'Fuel' },
  { name: '7-Eleven', category: 'Convenience' },
  { name: 'Kmart', category: 'Shopping' },
  { name: 'Target', category: 'Shopping' },
  { name: 'Big W', category: 'Shopping' },
  { name: 'Bunnings', category: 'Shopping' },
  { name: 'JB Hi-Fi', category: 'Electronics' },
  { name: "McDonald's", category: 'Food & Drink' },
  { name: 'KFC', category: 'Food & Drink' },
  { name: 'Hungry Jacks', category: 'Food & Drink' },
  { name: 'Guzman y Gomez', category: 'Food & Drink' },
  { name: 'Uber Eats', category: 'Food & Drink' },
  { name: 'Gloria Jeans', category: 'Coffee' },
  { name: 'The Coffee Club', category: 'Coffee' },
  { name: 'Starbucks', category: 'Coffee' },
  { name: 'Netflix', category: 'Entertainment' },
  { name: 'Spotify', category: 'Entertainment' },
  { name: 'Officeworks', category: 'Office' },
  { name: 'Chemist Warehouse', category: 'Health' },
  { name: 'Priceline', category: 'Health' },
  { name: 'Dan Murphy\'s', category: 'Drinks' },
  { name: 'BWS', category: 'Drinks' },
  { name: 'Boost Juice', category: 'Food & Drink' },
  { name: 'Domino\'s', category: 'Food & Drink' },
]

/**
 * Calculate the round-up amount for a given transaction.
 * @param {number} amount - Original purchase amount
 * @param {number} roundTo - Round up to nearest $1, $2, or $5
 * @returns {number} The round-up amount (difference)
 */
export function calculateRoundup(amount, roundTo) {
  if (amount <= 0 || roundTo <= 0) return 0
  const rounded = Math.ceil(amount / roundTo) * roundTo
  // If already a whole multiple, round up by one full unit
  const diff = rounded - amount
  return diff === 0 ? 0 : Math.round(diff * 100) / 100
}

/**
 * Generate realistic mock Australian merchant transactions.
 * @param {number} count - Number of transactions to generate
 * @param {number} daysBack - How many days back to spread transactions
 * @returns {Array} Array of mock transaction objects
 */
export function generateMockTransactions(count = 15, daysBack = 14) {
  const transactions = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const merchant = AU_MERCHANTS[Math.floor(Math.random() * AU_MERCHANTS.length)]
    const daysAgo = Math.floor(Math.random() * daysBack)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    // Realistic price ranges by category
    let min = 3, max = 25
    if (merchant.category === 'Groceries') { min = 8; max = 120 }
    else if (merchant.category === 'Fuel') { min = 30; max = 95 }
    else if (merchant.category === 'Shopping') { min = 10; max = 80 }
    else if (merchant.category === 'Electronics') { min = 15; max = 200 }
    else if (merchant.category === 'Coffee') { min = 3.5; max = 8 }
    else if (merchant.category === 'Entertainment') { min = 7; max = 20 }
    else if (merchant.category === 'Health') { min = 5; max = 45 }

    const amount = Math.round((min + Math.random() * (max - min)) * 100) / 100

    transactions.push({
      merchant_name: merchant.name,
      category: merchant.category,
      original_amount: amount,
      transaction_date: date.toISOString().split('T')[0],
    })
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
  return transactions
}

/**
 * Estimate monthly round-up savings for the setup page.
 * Based on average Australian spending patterns (~60 transactions/month).
 * @param {number} roundTo - Rounding amount ($1, $2, or $5)
 * @returns {{ monthly: number, weekly: number, yearly: number }}
 */
export function estimateMonthlyRoundup(roundTo) {
  // Average round-up per transaction by rounding amount
  const avgRoundup = { 1: 0.50, 2: 1.00, 5: 2.50 }
  const avg = avgRoundup[roundTo] || 0.50
  const txPerMonth = 60

  const monthly = Math.round(avg * txPerMonth * 100) / 100
  return {
    monthly,
    weekly: Math.round((monthly / 4.33) * 100) / 100,
    yearly: Math.round(monthly * 12 * 100) / 100,
  }
}

/**
 * Generate mock transactions, calculate round-ups, and save to Supabase.
 * @param {object} supabase - Supabase client instance
 * @param {string} userId - User ID
 * @param {string} settingId - roundup_settings row ID
 * @param {string} depositId - deposit_applications row ID
 * @param {number} roundTo - Rounding amount ($1, $2, or $5)
 * @returns {Promise<Array>} The inserted transaction rows
 */
export async function simulateAndSaveRoundups(supabase, userId, settingId, depositId, roundTo) {
  const mockTxns = generateMockTransactions(12, 7)

  const rows = mockTxns
    .map((txn) => {
      const roundupAmount = calculateRoundup(txn.original_amount, roundTo)
      if (roundupAmount === 0) return null
      const roundedAmount = txn.original_amount + roundupAmount
      return {
        user_id: userId,
        roundup_setting_id: settingId,
        deposit_application_id: depositId,
        merchant_name: txn.merchant_name,
        category: txn.category,
        original_amount: txn.original_amount,
        rounded_amount: Math.round(roundedAmount * 100) / 100,
        roundup_amount: roundupAmount,
        transaction_date: txn.transaction_date,
        status: 'pending',
      }
    })
    .filter(Boolean)

  if (rows.length === 0) return []

  const { data, error } = await supabase
    .from('roundup_transactions')
    .insert(rows)
    .select()

  if (error) throw error

  // Update total_contributed on settings
  const batchTotal = rows.reduce((sum, r) => sum + r.roundup_amount, 0)
  const { data: currentSetting } = await supabase
    .from('roundup_settings')
    .select('total_contributed')
    .eq('id', settingId)
    .single()

  const newTotal = Number(currentSetting?.total_contributed || 0) + batchTotal
  await supabase
    .from('roundup_settings')
    .update({ total_contributed: Math.round(newTotal * 100) / 100, updated_at: new Date().toISOString() })
    .eq('id', settingId)

  return data
}
