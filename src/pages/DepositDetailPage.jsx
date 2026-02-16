import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Landmark, DollarSign, Calendar, BarChart3,
  CheckCircle2, Clock, User, Building2, TrendingUp
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import DepositStatusBadge from '../components/deposit/DepositStatusBadge'

export default function DepositDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [deposit, setDeposit] = useState(null)
  const [repayments, setRepayments] = useState([])
  const [roundupData, setRoundupData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const [{ data: dep, error: depErr }, { data: reps }] = await Promise.all([
          supabase.from('deposit_applications').select('*').eq('id', id).eq('user_id', user.id).single(),
          supabase.from('repayments').select('*').eq('deposit_application_id', id).order('week_number', { ascending: true }),
        ])
        if (depErr) throw depErr
        setDeposit(dep)
        setRepayments(reps || [])

        // Fetch round-up data for this deposit
        const { data: roundupSettings } = await supabase
          .from('roundup_settings')
          .select('id, total_contributed')
          .eq('deposit_application_id', id)
          .eq('user_id', user.id)
          .limit(1)
          .single()

        if (roundupSettings) {
          const { count } = await supabase
            .from('roundup_transactions')
            .select('id', { count: 'exact', head: true })
            .eq('roundup_setting_id', roundupSettings.id)

          setRoundupData({
            total: Number(roundupSettings.total_contributed || 0),
            count: count || 0,
          })
        }
      } catch {
        navigate('/deposit-aid', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, user.id, navigate])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="h-60 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  if (!deposit) return null

  const paidCount = repayments.filter((r) => r.status === 'paid').length
  const totalWeeks = deposit.plan_weeks || 0
  const progressPct = totalWeeks > 0 ? Math.round((paidCount / totalWeeks) * 100) : 0
  const nextPayment = repayments.find((r) => r.status === 'upcoming')

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/deposit-aid"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deposit Aid
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy mb-1">
            ${Number(deposit.deposit_amount).toLocaleString('en-AU')} Deposit
          </h1>
          <p className="text-sm text-gray-500">
            {deposit.plan_weeks} week plan · Created {new Date(deposit.created_at).toLocaleDateString('en-AU')}
          </p>
        </div>
        <DepositStatusBadge status={deposit.status} />
      </div>

      {/* Progress (active only) */}
      {deposit.status === 'active' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Repayment Progress</p>
            <span className="text-sm text-gray-500">{paidCount}/{totalWeeks} weeks</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-coral-500 rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {nextPayment && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-coral-500" />
              Next payment: <span className="font-semibold">${Number(nextPayment.amount).toFixed(2)}</span> due{' '}
              {new Date(nextPayment.due_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
            </div>
          )}
        </div>
      )}

      {/* Deposit details */}
      <div className="space-y-4">
        <Section icon={DollarSign} title="Financial Details">
          <Row label="Deposit amount" value={`$${Number(deposit.deposit_amount).toLocaleString('en-AU')}`} />
          <Row label="Weekly payment" value={`$${Number(deposit.weekly_payment).toFixed(2)}`} />
          <Row label="Total repayment" value={`$${Number(deposit.total_repayment).toFixed(2)}`} />
          <Row label="Setup fee" value={`$${Number(deposit.setup_fee || 200)}`} />
          <Row label="Interest rate" value={`${((deposit.interest_rate || 0.20) * 100).toFixed(1)}%`} />
          <Row label="Plan duration" value={`${deposit.plan_weeks} weeks`} />
        </Section>

        {roundupData && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-coral-500" />
              <h2 className="text-sm font-semibold text-gray-700">Round-Up Contributions</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total contributed</span>
                <span className="text-emerald-600 font-semibold">${roundupData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transactions</span>
                <span className="text-navy font-medium">{roundupData.count}</span>
              </div>
            </div>
            <Link
              to="/round-up"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-coral-500 hover:text-coral-600 transition-colors"
            >
              View Round-Up dashboard &rarr;
            </Link>
          </div>
        )}

        {deposit.credit_score && (
          <Section icon={BarChart3} title="Cash Flow Assessment">
            <Row label="LATR score" value={`${deposit.credit_score} / 100`} />
            <Row label="Approved limit" value={`$${Number(deposit.credit_limit || 0).toLocaleString('en-AU')}`} />
          </Section>
        )}

        <Section icon={deposit.recipient_type === 'agency' ? Building2 : User} title="Recipient Details">
          <Row label="Type" value={deposit.recipient_type} />
          <Row label="Name" value={deposit.recipient_name} />
          <Row label="BSB" value={deposit.recipient_bsb} />
          <Row label="Account" value={deposit.recipient_account} />
          {deposit.recipient_email && <Row label="Email" value={deposit.recipient_email} />}
          {deposit.agent_name && <Row label="Agent" value={deposit.agent_name} />}
          {deposit.transfer_status && (
            <Row
              label="Transfer status"
              value={
                <span className={`capitalize ${
                  deposit.transfer_status === 'completed' ? 'text-emerald-600' :
                  deposit.transfer_status === 'processing' ? 'text-yellow-600' : 'text-gray-600'
                }`}>
                  {deposit.transfer_status}
                </span>
              }
            />
          )}
        </Section>

        {/* Repayment schedule */}
        {repayments.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-coral-500" />
              <h2 className="text-sm font-semibold text-gray-700">Repayment Schedule</h2>
            </div>
            <div className="max-h-80 overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="text-gray-500 text-xs">
                    <th className="text-left pb-2 font-medium">Week</th>
                    <th className="text-left pb-2 font-medium">Due Date</th>
                    <th className="text-right pb-2 font-medium">Amount</th>
                    <th className="text-right pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {repayments.map((r) => (
                    <tr key={r.id || r.week_number}>
                      <td className="py-2 text-navy font-medium">{r.week_number}</td>
                      <td className="py-2 text-gray-600">
                        {new Date(r.due_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-2 text-right text-navy">${Number(r.amount).toFixed(2)}</td>
                      <td className="py-2 text-right">
                        <RepaymentBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-coral-500" />
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-navy font-medium text-right capitalize">{value || '—'}</span>
    </div>
  )
}

function RepaymentBadge({ status }) {
  const config = {
    paid: { label: 'Paid', cls: 'text-emerald-600 bg-emerald-50' },
    upcoming: { label: 'Upcoming', cls: 'text-gray-500 bg-gray-100' },
    overdue: { label: 'Overdue', cls: 'text-red-600 bg-red-50' },
    processing: { label: 'Processing', cls: 'text-yellow-600 bg-yellow-50' },
  }
  const c = config[status] || config.upcoming
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.cls}`}>
      {c.label}
    </span>
  )
}
