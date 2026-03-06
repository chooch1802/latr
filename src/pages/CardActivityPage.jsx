import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { getCardTransactions } from '../lib/fidelApi'

const statusStyles = {
  awarded: 'bg-emerald-50 text-emerald-600',
  ineligible: 'bg-gray-100 text-gray-500',
  reversed: 'bg-red-50 text-red-500',
  pending: 'bg-amber-50 text-amber-600',
}

export default function CardActivityPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getCardTransactions({ limit: 50 })
        setTransactions(data)
      } catch {
        // Will show empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-60 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/rewards" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">Card Activity</h1>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-1">No card-linked transactions yet</p>
          <p className="text-xs text-gray-400">Link a card and pay at a partner to see activity here</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {transactions.map((txn) => (
            <div key={txn.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy truncate">{txn.merchant_name}</p>
                <p className="text-xs text-gray-400">
                  {new Date(txn.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {txn.partner?.name && ` \u00b7 ${txn.partner.name}`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-navy">${Math.abs(txn.amount).toFixed(2)}</p>
                {txn.points_awarded !== 0 && (
                  <p className={`text-xs font-bold ${txn.points_awarded > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {txn.points_awarded > 0 ? '+' : ''}{txn.points_awarded} pts
                  </p>
                )}
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${statusStyles[txn.status] || statusStyles.pending}`}>
                {txn.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
