import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Receipt, DollarSign, Clock, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import BillCard from '../components/household/BillCard'

const filters = ['all', 'pending', 'paid', 'overdue']

export default function BillsPage() {
  const { user } = useAuth()
  const [bills, setBills] = useState([])
  const [splits, setSplits] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [householdId, setHouseholdId] = useState(null)

  useEffect(() => {
    async function fetch() {
      const { data: membership } = await supabase
        .from('household_members')
        .select('household_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .single()

      if (!membership) {
        setLoading(false)
        return
      }

      setHouseholdId(membership.household_id)

      const [{ data: bls }, { data: sp }] = await Promise.all([
        supabase
          .from('bills')
          .select('*')
          .eq('household_id', membership.household_id)
          .order('due_date', { ascending: false }),
        supabase
          .from('bill_splits')
          .select('*')
          .eq('user_id', user.id),
      ])

      setBills(bls || [])
      setSplits(sp || [])
      setLoading(false)
    }
    fetch()
  }, [user.id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-24 bg-gray-200 rounded-xl" />
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  const filtered = filter === 'all' ? bills : bills.filter((b) => b.status === filter)
  const totalPending = bills.filter((b) => b.status === 'pending' || b.status === 'overdue').reduce((s, b) => s + Number(b.total_amount || 0), 0)
  const totalPaid = bills.filter((b) => b.status === 'paid').reduce((s, b) => s + Number(b.total_amount || 0), 0)
  const myUnpaid = splits.filter((s) => !s.paid).reduce((s, sp) => s + Number(sp.amount || 0), 0)

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/household"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Household Hub
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-navy">Bills</h1>
        <Link
          to="/household/bills/add"
          className="h-10 px-4 bg-coral-500 text-white font-medium rounded-xl inline-flex items-center gap-2 text-sm hover:bg-coral-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Bill
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Pending</p>
              <p className="text-sm font-bold text-navy">${totalPending.toFixed(0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Paid</p>
              <p className="text-sm font-bold text-navy">${totalPaid.toFixed(0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-coral-50 text-coral-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-400">You Owe</p>
              <p className="text-sm font-bold text-navy">${myUnpaid.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer capitalize ${
              filter === f
                ? 'bg-coral-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bills list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-3">
            {filter === 'all' ? 'No bills yet' : `No ${filter} bills`}
          </p>
          {filter === 'all' && (
            <Link
              to="/household/bills/add"
              className="text-sm font-semibold text-coral-500 hover:text-coral-600"
            >
              Add your first bill
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((bill) => {
            const mySplit = splits.find((s) => s.bill_id === bill.id)
            return <BillCard key={bill.id} bill={bill} userShare={mySplit?.amount} />
          })}
        </div>
      )}
    </div>
  )
}
