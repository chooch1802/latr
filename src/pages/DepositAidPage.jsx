import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Landmark, Calculator, Plus, DollarSign, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import DepositStatusBadge from '../components/deposit/DepositStatusBadge'

export default function DepositAidPage() {
  const { user } = useAuth()
  const [deposits, setDeposits] = useState([])
  const [paidCounts, setPaidCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('deposit_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setDeposits(data || [])

      // Fetch paid repayment counts for active deposits
      const active = (data || []).filter((d) => d.status === 'active')
      if (active.length > 0) {
        const counts = {}
        await Promise.all(
          active.map(async (d) => {
            const { count } = await supabase
              .from('repayments')
              .select('*', { count: 'exact', head: true })
              .eq('deposit_application_id', d.id)
              .eq('status', 'paid')
            counts[d.id] = count || 0
          })
        )
        setPaidCounts(counts)
      }

      setLoading(false)
    }
    fetch()
  }, [user.id])

  const activeDeposits = deposits.filter((d) => d.status === 'active')
  const totalOwed = activeDeposits.reduce((sum, d) => sum + Number(d.total_repayment || 0), 0)
  const totalDeposits = deposits.length

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
        </div>
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Deposit Aid</h1>
          <p className="text-gray-500 text-sm">Manage your deposit financing</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/deposit-calculator"
            className="h-10 px-4 border-2 border-gray-200 text-gray-700 font-medium rounded-xl inline-flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Calculator
          </Link>
          <Link
            to="/deposit-aid/apply"
            className="h-10 px-4 bg-coral-500 text-white font-medium rounded-xl inline-flex items-center gap-2 text-sm hover:bg-coral-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Apply
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          iconBg="bg-blue-50 text-blue-500"
          label="Total Applications"
          value={totalDeposits}
        />
        <StatCard
          icon={Clock}
          iconBg="bg-yellow-50 text-yellow-600"
          label="Active Plans"
          value={activeDeposits.length}
        />
        <StatCard
          icon={Landmark}
          iconBg="bg-emerald-50 text-emerald-500"
          label="Total Financed"
          value={`$${totalOwed.toLocaleString('en-AU', { minimumFractionDigits: 0 })}`}
        />
      </div>

      {/* Deposits list */}
      {deposits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Landmark className="w-7 h-7 text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-navy mb-1">No deposit applications yet</h2>
          <p className="text-sm text-gray-500 mb-4">
            LATR pays your deposit directly to your landlord or agency. You repay weekly.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/deposit-calculator"
              className="h-10 px-4 border-2 border-gray-200 text-gray-700 font-medium rounded-xl inline-flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Try Calculator
            </Link>
            <Link
              to="/deposit-aid/apply"
              className="h-10 px-4 bg-coral-500 text-white font-medium rounded-xl inline-flex items-center gap-2 text-sm hover:bg-coral-600 transition-colors"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {deposits.map((deposit) => (
            <DepositCard key={deposit.id} deposit={deposit} paidWeeks={paidCounts[deposit.id] || 0} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, iconBg, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-lg font-bold text-navy">{value}</p>
        </div>
      </div>
    </div>
  )
}

function DepositCard({ deposit, paidWeeks = 0 }) {
  const totalWeeks = deposit.plan_weeks || 0
  const progressPct = totalWeeks > 0 ? Math.round((paidWeeks / totalWeeks) * 100) : 0

  return (
    <Link
      to={`/deposit-aid/${deposit.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-medium hover:border-gray-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-navy">
            ${Number(deposit.deposit_amount).toLocaleString('en-AU')} Deposit
          </p>
          <p className="text-sm text-gray-500">
            {deposit.plan_weeks} week plan · ${Number(deposit.weekly_payment).toFixed(2)}/week
          </p>
        </div>
        <DepositStatusBadge status={deposit.status} />
      </div>

      {deposit.status === 'active' && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{paidWeeks} of {totalWeeks} weeks paid</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-coral-500 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {deposit.status === 'approved' && (
        <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" />
          Ready to activate
        </p>
      )}

      <p className="text-xs text-gray-400 mt-2">
        Created {new Date(deposit.created_at).toLocaleDateString('en-AU')}
      </p>
    </Link>
  )
}
