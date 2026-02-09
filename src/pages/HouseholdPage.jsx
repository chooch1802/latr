import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Plus, Receipt, DollarSign, Calendar, Home, Clock, ArrowRight, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import BillCard from '../components/household/BillCard'

export default function HouseholdPage() {
  const { user } = useAuth()
  const [household, setHousehold] = useState(null)
  const [members, setMembers] = useState([])
  const [bills, setBills] = useState([])
  const [splits, setSplits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      // Find user's active household
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

      const hId = membership.household_id

      const [{ data: hh }, { data: mems }, { data: bls }, { data: sp }] = await Promise.all([
        supabase.from('households').select('*').eq('id', hId).single(),
        supabase.from('household_members').select('*').eq('household_id', hId).neq('status', 'left'),
        supabase.from('bills').select('*').eq('household_id', hId).order('due_date', { ascending: true }).limit(20),
        supabase.from('bill_splits').select('*').eq('user_id', user.id),
      ])

      setHousehold(hh)
      setMembers(mems || [])
      setBills(bls || [])
      setSplits(sp || [])
      setLoading(false)
    }
    fetch()
  }, [user.id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
        </div>
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  // No household — show create CTA
  if (!household) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">Household Hub</h1>
        <p className="text-gray-500 mb-6">
          Create a household to manage roommates, split bills, and track shared expenses.
        </p>
        <Link
          to="/household/create"
          className="h-11 px-6 bg-coral-500 text-white font-semibold rounded-xl inline-flex items-center gap-2 hover:bg-coral-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Household
        </Link>
      </div>
    )
  }

  const upcomingBills = bills.filter((b) => b.status !== 'paid')
  const pendingBills = bills.filter((b) => b.status === 'pending' || b.status === 'overdue')
  const myUnpaidSplits = splits.filter((s) => !s.paid)
  const myShareTotal = myUnpaidSplits.reduce((sum, s) => sum + Number(s.amount || 0), 0)
  const activeMembers = members.filter((m) => m.status === 'active')

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-1">Household Hub</h1>
          <p className="text-gray-500 text-sm">{household.name}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/household/bills/add"
            className="h-10 px-4 bg-coral-500 text-white font-medium rounded-xl inline-flex items-center gap-2 text-sm hover:bg-coral-600 transition-colors"
          >
            <Receipt className="w-4 h-4" />
            Add Bill
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Users} iconBg="bg-emerald-50 text-emerald-500" label="Members" value={activeMembers.length} />
        <StatCard icon={Home} iconBg="bg-coral-50 text-coral-500" label="Monthly Rent" value={household.monthly_rent ? `$${Number(household.monthly_rent).toLocaleString('en-AU')}` : '—'} />
        <StatCard icon={Receipt} iconBg="bg-yellow-50 text-yellow-600" label="Pending Bills" value={pendingBills.length} />
        <StatCard icon={DollarSign} iconBg="bg-blue-50 text-blue-500" label="Your Share" value={`$${myShareTotal.toFixed(0)}`} />
      </div>

      {/* Household card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-semibold text-navy">{household.name}</h2>
            {household.address && <p className="text-sm text-gray-500">{household.address}</p>}
          </div>
          <Link
            to={`/household/${household.id}/manage`}
            className="text-sm font-medium text-coral-500 hover:text-coral-600"
          >
            Manage
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {household.move_in_date && (
            <div>
              <p className="text-gray-400 text-xs">Move-in</p>
              <p className="text-navy font-medium">{new Date(household.move_in_date).toLocaleDateString('en-AU')}</p>
            </div>
          )}
          {household.lease_end_date && (
            <div>
              <p className="text-gray-400 text-xs">Lease ends</p>
              <p className="text-navy font-medium">{new Date(household.lease_end_date).toLocaleDateString('en-AU')}</p>
            </div>
          )}
          <div>
            <p className="text-gray-400 text-xs">Members</p>
            <p className="text-navy font-medium">{activeMembers.length}</p>
          </div>
          {household.monthly_rent && (
            <div>
              <p className="text-gray-400 text-xs">Monthly rent</p>
              <p className="text-navy font-medium">${Number(household.monthly_rent).toLocaleString('en-AU')}</p>
            </div>
          )}
        </div>
        {/* Member avatars */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
          {activeMembers.slice(0, 5).map((m, i) => (
            <div key={m.id} className="w-8 h-8 rounded-full bg-coral-500 text-white flex items-center justify-center text-xs font-semibold" title={m.invited_email || 'Member'}>
              {(m.invited_email?.[0] || String(i + 1)).toUpperCase()}
            </div>
          ))}
          {members.filter((m) => m.status === 'invited').length > 0 && (
            <span className="text-xs text-gray-400 ml-2">{members.filter((m) => m.status === 'invited').length} pending</span>
          )}
        </div>
      </div>

      {/* Upcoming bills */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Upcoming Bills</h2>
          <Link to="/household/bills" className="text-sm text-coral-500 font-medium hover:text-coral-600">
            View all
          </Link>
        </div>
        {upcomingBills.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-gray-400 text-sm mb-3">No upcoming bills</p>
            <Link
              to="/household/bills/add"
              className="text-sm font-semibold text-coral-500 hover:text-coral-600 inline-flex items-center gap-1"
            >
              Add a bill <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingBills.slice(0, 5).map((bill) => {
              const mySplit = splits.find((s) => s.bill_id === bill.id)
              return <BillCard key={bill.id} bill={bill} userShare={mySplit?.amount} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, iconBg, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-sm font-bold text-navy">{value}</p>
        </div>
      </div>
    </div>
  )
}
