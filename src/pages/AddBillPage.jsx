import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Receipt, Users, Percent, Sliders } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { createBulkNotifications } from '../lib/notifications'

const categories = [
  { value: 'rent', label: 'Rent' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'gas', label: 'Gas' },
  { value: 'water', label: 'Water' },
  { value: 'internet', label: 'Internet' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'other', label: 'Other' },
]

const splitMethods = [
  { value: 'equal', label: 'Split Equally', icon: Users, desc: 'Divide evenly among all members' },
  { value: 'percentage', label: 'By Share %', icon: Percent, desc: 'Use each member\'s share percentage' },
  { value: 'custom', label: 'Custom', icon: Sliders, desc: 'Set custom amounts per member' },
]

export default function AddBillPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [members, setMembers] = useState([])
  const [householdId, setHouseholdId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('other')
  const [totalAmount, setTotalAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [recurrenceInterval, setRecurrenceInterval] = useState('monthly')
  const [splitMethod, setSplitMethod] = useState('equal')
  const [customAmounts, setCustomAmounts] = useState({})
  const [notes, setNotes] = useState('')

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
        navigate('/household', { replace: true })
        return
      }

      setHouseholdId(membership.household_id)

      const { data: mems } = await supabase
        .from('household_members')
        .select('*')
        .eq('household_id', membership.household_id)
        .eq('status', 'active')

      setMembers(mems || [])
      setLoading(false)
    }
    fetch()
  }, [user.id, navigate])

  function getSplits() {
    const amount = Number(totalAmount) || 0
    if (!amount || members.length === 0) return []

    if (splitMethod === 'equal') {
      const share = Math.round((amount / members.length) * 100) / 100
      return members.map((m) => ({ user_id: m.user_id, amount: share }))
    }

    if (splitMethod === 'percentage') {
      return members.map((m) => ({
        user_id: m.user_id,
        amount: Math.round((amount * (m.share_percentage || 0)) / 100 * 100) / 100,
      }))
    }

    // custom
    return members.map((m) => ({
      user_id: m.user_id,
      amount: Number(customAmounts[m.user_id] || 0),
    }))
  }

  const splits = getSplits()
  const splitsTotal = splits.reduce((s, sp) => s + sp.amount, 0)
  const amount = Number(totalAmount) || 0
  const splitsMatch = amount > 0 && Math.abs(splitsTotal - amount) < 0.02

  async function handleSubmit() {
    if (!totalAmount || !dueDate || !splitsMatch) return
    setSubmitting(true)

    try {
      const { data: bill, error: billErr } = await supabase
        .from('bills')
        .insert({
          household_id: householdId,
          title: title || null,
          category,
          total_amount: amount,
          due_date: dueDate,
          recurring,
          recurrence_interval: recurring ? recurrenceInterval : null,
          status: 'pending',
          split_method: splitMethod,
          notes: notes || null,
          created_by: user.id,
        })
        .select()
        .single()

      if (billErr) throw billErr

      // Create splits
      await supabase.from('bill_splits').insert(
        splits.map((sp) => ({
          bill_id: bill.id,
          user_id: sp.user_id,
          amount: sp.amount,
          paid: false,
        }))
      )

      // Notify other household members
      const otherMembers = members
        .filter((m) => m.user_id !== user.id)
        .map((m) => m.user_id)
      const billName = title || category
      await createBulkNotifications(
        otherMembers,
        'bill_created',
        `New bill: ${billName}`,
        `A new $${amount.toFixed(2)} ${category} bill has been added.`,
        { link: `/household/bills/${bill.id}`, bill_id: bill.id }
      )

      toast.success('Bill created successfully!')
      navigate('/household/bills', { replace: true })
    } catch (err) {
      toast.error('Failed to create bill. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/household/bills"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Bills
      </Link>

      <h1 className="text-xl font-bold text-navy mb-6">Add Bill</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Bill Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-300 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent bg-white"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Title (optional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. ${category === 'rent' ? 'February Rent' : 'Q1 Bill'}`}
              className="w-full h-10 px-3 rounded-xl border border-gray-300 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Total amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-10 pl-7 pr-3 rounded-xl border border-gray-300 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Due date *</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-300 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recurring toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-coral-500 focus:ring-coral-500"
              />
              <span className="text-sm text-gray-700">Recurring bill</span>
            </label>
            {recurring && (
              <select
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(e.target.value)}
                className="h-8 px-2 rounded-lg border border-gray-300 text-sm text-navy bg-white"
              >
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any additional details..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Split method */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Split Method</h2>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {splitMethods.map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.value}
                onClick={() => setSplitMethod(m.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  splitMethod === m.value
                    ? 'border-coral-500 bg-coral-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${splitMethod === m.value ? 'text-coral-500' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-navy">{m.label}</p>
                <p className="text-xs text-gray-400">{m.desc}</p>
              </button>
            )
          })}
        </div>

        {/* Split preview */}
        {amount > 0 && members.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Split Breakdown</h3>
            <div className="space-y-2">
              {members.map((m) => {
                const split = splits.find((s) => s.user_id === m.user_id)
                return (
                  <div key={m.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-coral-500 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {(m.invited_email?.[0] || '?').toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm text-navy truncate">
                      {m.invited_email || 'Member'}
                      {m.user_id === user.id && ' (You)'}
                    </span>
                    {splitMethod === 'custom' ? (
                      <div className="relative w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={customAmounts[m.user_id] || ''}
                          onChange={(e) => setCustomAmounts({ ...customAmounts, [m.user_id]: e.target.value })}
                          className="w-full h-8 pl-5 pr-2 rounded-lg border border-gray-300 text-sm text-navy text-right focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-navy">
                        ${(split?.amount || 0).toFixed(2)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className={`text-sm p-2 rounded-lg mt-2 ${splitsMatch ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              Total: ${splitsTotal.toFixed(2)} / ${amount.toFixed(2)}
              {splitsMatch ? ' — looks good!' : ' — must match bill total'}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!totalAmount || !dueDate || !splitsMatch || submitting}
        className="w-full h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Receipt className="w-4 h-4" />
            Create Bill
          </>
        )}
      </button>
    </div>
  )
}
