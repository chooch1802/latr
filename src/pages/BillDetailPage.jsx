import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Repeat, CheckCircle2, Clock, AlertCircle, Trash2, Loader2, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { createNotification } from '../lib/notifications'
import BillStatusBadge from '../components/household/BillStatusBadge'
import { categoryIcons, categoryColors } from '../components/household/BillCard'

export default function BillDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [bill, setBill] = useState(null)
  const [splits, setSplits] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [markingPaid, setMarkingPaid] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data: b, error } = await supabase
        .from('bills')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !b) {
        navigate('/household/bills', { replace: true })
        return
      }

      const [{ data: sp }, { data: mems }] = await Promise.all([
        supabase.from('bill_splits').select('*').eq('bill_id', id),
        supabase.from('household_members').select('*').eq('household_id', b.household_id).eq('status', 'active'),
      ])

      setBill(b)
      setSplits(sp || [])
      setMembers(mems || [])
      setLoading(false)
    }
    fetch()
  }, [id, navigate])

  async function handleMarkPaid(splitId) {
    setMarkingPaid(splitId)
    await supabase
      .from('bill_splits')
      .update({ paid: true, paid_at: new Date().toISOString() })
      .eq('id', splitId)

    const updated = splits.map((s) => (s.id === splitId ? { ...s, paid: true, paid_at: new Date().toISOString() } : s))
    setSplits(updated)

    // Check if all splits are paid
    const allPaid = updated.every((s) => s.paid)
    const anyPaid = updated.some((s) => s.paid)

    const newStatus = allPaid ? 'paid' : anyPaid ? 'partially_paid' : bill.status
    if (newStatus !== bill.status) {
      await supabase.from('bills').update({ status: newStatus }).eq('id', id)
      setBill({ ...bill, status: newStatus })
    }

    // Notify the bill creator that a split was marked as paid
    const split = splits.find((s) => s.id === splitId)
    if (bill.created_by !== user.id && split) {
      const member = members.find((m) => m.user_id === split.user_id)
      await createNotification(
        bill.created_by,
        'payment_marked',
        `Payment received for ${bill.title || bill.category}`,
        `${member?.invited_email || 'A member'} marked their $${Number(split.amount).toFixed(2)} split as paid.`,
        { link: `/household/bills/${id}`, bill_id: id }
      )
    }

    setMarkingPaid(null)
  }

  async function handleUnmarkPaid(splitId) {
    setMarkingPaid(splitId)
    await supabase
      .from('bill_splits')
      .update({ paid: false, paid_at: null })
      .eq('id', splitId)

    const updated = splits.map((s) => (s.id === splitId ? { ...s, paid: false, paid_at: null } : s))
    setSplits(updated)

    const anyPaid = updated.some((s) => s.paid)
    const newStatus = anyPaid ? 'partially_paid' : 'pending'
    if (newStatus !== bill.status) {
      await supabase.from('bills').update({ status: newStatus }).eq('id', id)
      setBill({ ...bill, status: newStatus })
    }

    setMarkingPaid(null)
  }

  async function handleDelete() {
    if (!confirm('Delete this bill? This cannot be undone.')) return
    setDeleting(true)
    await supabase.from('bill_splits').delete().eq('bill_id', id)
    await supabase.from('bills').delete().eq('id', id)
    navigate('/household/bills', { replace: true })
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  const Icon = categoryIcons[bill.category] || categoryIcons.other
  const color = categoryColors[bill.category] || categoryColors.other
  const paidCount = splits.filter((s) => s.paid).length
  const paidAmount = splits.filter((s) => s.paid).reduce((sum, s) => sum + Number(s.amount || 0), 0)
  const progressPct = Number(bill.total_amount) > 0 ? (paidAmount / Number(bill.total_amount)) * 100 : 0
  const isCreator = bill.created_by === user.id

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/household/bills"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Bills
      </Link>

      {/* Bill header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg font-bold text-navy capitalize truncate">{bill.title || bill.category}</h1>
              <BillStatusBadge status={bill.status} />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Due {new Date(bill.due_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              {bill.recurring && (
                <span className="inline-flex items-center gap-1">
                  <Repeat className="w-3.5 h-3.5" />
                  {bill.recurrence_interval}
                </span>
              )}
              <span className="capitalize">{bill.split_method} split</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-navy shrink-0">${Number(bill.total_amount).toFixed(2)}</p>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{paidCount} of {splits.length} paid</span>
            <span>${paidAmount.toFixed(2)} / ${Number(bill.total_amount).toFixed(2)}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min(progressPct, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      {bill.notes && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700">Notes</h2>
          </div>
          <p className="text-sm text-gray-600">{bill.notes}</p>
        </div>
      )}

      {/* Splits */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Split Breakdown</h2>
        <div className="space-y-2">
          {splits.map((split) => {
            const member = members.find((m) => m.user_id === split.user_id)
            const isMe = split.user_id === user.id
            return (
              <div key={split.id} className={`flex items-center gap-3 p-3 rounded-xl ${split.paid ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                  split.paid ? 'bg-emerald-500 text-white' : 'bg-coral-500 text-white'
                }`}>
                  {split.paid ? <CheckCircle2 className="w-4 h-4" /> : (member?.invited_email?.[0] || '?').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">
                    {member?.invited_email || 'Member'}
                    {isMe && ' (You)'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {split.paid
                      ? `Paid ${split.paid_at ? new Date(split.paid_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : ''}`
                      : 'Unpaid'}
                  </p>
                </div>
                <p className={`text-sm font-bold shrink-0 ${split.paid ? 'text-emerald-600' : 'text-navy'}`}>
                  ${Number(split.amount).toFixed(2)}
                </p>
                {/* Mark paid / unpaid buttons */}
                {(isMe || isCreator) && (
                  <button
                    onClick={() => split.paid ? handleUnmarkPaid(split.id) : handleMarkPaid(split.id)}
                    disabled={markingPaid === split.id}
                    className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      split.paid
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    } disabled:opacity-50`}
                  >
                    {markingPaid === split.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : split.paid ? (
                      'Undo'
                    ) : (
                      'Mark Paid'
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Delete */}
      {isCreator && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full h-10 border-2 border-red-200 text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete Bill
        </button>
      )}
    </div>
  )
}
