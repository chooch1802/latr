import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, FileText, Loader2, AlertTriangle, Building2, ExternalLink, Bot } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../contexts/ToastContext'
import { getDecisionLog } from '../../lib/decisionApi'
import DepositStatusBadge from '../../components/deposit/DepositStatusBadge'

const BV_LAYER_LABELS = {
  abn: { label: 'ABN Lookup', verifiedKey: 'abn_verified', checkedKey: 'abn_checked_at' },
  asic: { label: 'ASIC Directors', verifiedKey: 'asic_verified', checkedKey: 'asic_checked_at' },
  equifax: { label: 'Equifax Commercial', verifiedKey: 'equifax_verified', checkedKey: 'equifax_checked_at' },
  cw: { label: 'CreditorWatch', verifiedKey: 'cw_verified', checkedKey: 'cw_checked_at' },
}

export default function AdminDepositDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [deposit, setDeposit] = useState(null)
  const [businessVerification, setBusinessVerification] = useState(null)
  const [decisionLog, setDecisionLog] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('deposit_applications')
        .select('*, users:user_id (first_name, last_name, email, phone, kyc_status, basiq_user_id)')
        .eq('id', id)
        .single()

      if (error || !data) {
        navigate('/admin/deposits', { replace: true })
        return
      }
      setDeposit(data)

      // Check for business verification
      if (data.applicant_type === 'business') {
        const { data: bv } = await supabase
          .from('business_verifications')
          .select('*')
          .eq('deposit_application_id', id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (bv) setBusinessVerification(bv)
      }

      // Fetch decision log
      try {
        const log = await getDecisionLog(id)
        setDecisionLog(log)
      } catch {
        // Non-critical — admin can still review without it
      }

      setLoading(false)
    }
    load()
  }, [id, navigate])

  async function handleReview(action) {
    setReviewing(true)
    try {
      const res = await supabase.functions.invoke('admin-review-deposit', {
        body: {
          depositId: id,
          action,
          reason: action === 'reject' ? rejectReason : undefined,
        },
      })
      if (res.error) throw new Error(res.error.message)
      toast.success(`Deposit ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      // Reload
      const { data } = await supabase
        .from('deposit_applications')
        .select('*, users:user_id (first_name, last_name, email, phone, kyc_status, basiq_user_id)')
        .eq('id', id)
        .single()
      setDeposit(data)
      setShowRejectForm(false)
    } catch (err) {
      toast.error(err.message || 'Failed to review deposit')
    } finally {
      setReviewing(false)
    }
  }

  async function handleViewLease() {
    if (!deposit?.lease_document_url) return
    const { data } = await supabase.storage.from('deposit-documents').createSignedUrl(deposit.lease_document_url, 300)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-60 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  const user = deposit.users || {}

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/admin/deposits" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Deposits
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-navy">
          ${Number(deposit.deposit_amount).toLocaleString('en-AU')} Deposit
        </h1>
        <DepositStatusBadge status={deposit.status} />
      </div>

      {/* Applicant info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Applicant</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Name" value={`${user.first_name || ''} ${user.last_name || ''}`} />
          <Row label="Email" value={user.email} />
          <Row label="Phone" value={user.phone} />
          <div>
            <span className="text-gray-400">KYC Status</span>
            <p className="mt-0.5">
              <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                user.kyc_status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                user.kyc_status === 'pending' ? 'bg-amber-100 text-amber-700' :
                user.kyc_status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {user.kyc_status || 'Not started'}
              </span>
            </p>
          </div>
          <div>
            <span className="text-gray-400">Bank Connection</span>
            <p className="mt-0.5">
              <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                user.basiq_user_id ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {user.basiq_user_id ? 'Connected' : 'Not connected'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Deposit Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Deposit Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Amount" value={`$${Number(deposit.deposit_amount).toLocaleString('en-AU')}`} />
          <Row label="Plan" value={`${deposit.plan_weeks} weeks`} />
          <Row label="Weekly Payment" value={`$${Number(deposit.weekly_payment).toFixed(2)}`} />
          <Row label="Total Repayment" value={`$${Number(deposit.total_repayment).toFixed(2)}`} />
          <Row label="Interest Rate" value={deposit.interest_rate != null ? `${deposit.interest_rate}%` : null} />
          <Row label="Applicant Type" value={deposit.applicant_type} />
        </div>
      </div>

      {/* Recipient Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recipient Details</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Type" value={deposit.recipient_type} />
          <Row label="Name" value={deposit.recipient_name} />
          <Row label="BSB" value={deposit.recipient_bsb} />
          <Row label="Account" value={deposit.recipient_account} />
          <Row label="Email" value={deposit.recipient_email} />
          <Row label="Agent Name" value={deposit.agent_name} />
        </div>
      </div>

      {/* Lease Document */}
      {deposit.lease_document_url && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Lease Document</h2>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 flex-1">{deposit.lease_document_url.split('/').pop()}</span>
            <button
              type="button"
              onClick={handleViewLease}
              className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              View PDF
            </button>
          </div>
        </div>
      )}

      {/* Cash Flow Assessment */}
      {deposit.credit_score != null && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Cash Flow Assessment</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Row label="LATR Score" value={deposit.credit_score} />
            <Row label="Credit Limit" value={deposit.credit_limit != null ? `$${Number(deposit.credit_limit).toLocaleString('en-AU')}` : null} />
          </div>
        </div>
      )}

      {/* Auto-Decision */}
      {deposit.auto_decision && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-purple-500" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Auto-Decision</h2>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
            <div>
              <p className="text-sm font-medium text-navy">Result</p>
              <p className="text-xs text-gray-500">
                {deposit.auto_decision_at
                  ? new Date(deposit.auto_decision_at).toLocaleString('en-AU')
                  : '—'}
              </p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              deposit.auto_decision === 'approved' ? 'bg-emerald-100 text-emerald-700' :
              deposit.auto_decision === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {deposit.auto_decision === 'manual_review' ? 'Manual Review' : deposit.auto_decision}
            </span>
          </div>

          {/* Signal breakdown */}
          {deposit.decision_signals && Object.keys(deposit.decision_signals).length > 0 && (
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <Row label="KYC Status" value={deposit.decision_signals.kyc_status} />
              <Row label="Basiq Score" value={deposit.decision_signals.basiq_score != null ? `${deposit.decision_signals.basiq_score}/100` : null} />
              <Row label="Deposit Amount" value={`$${Number(deposit.decision_signals.deposit_amount).toLocaleString('en-AU')}`} />
              <Row label="Applicant Type" value={deposit.decision_signals.applicant_type} />
              {deposit.decision_signals.business_verification && (
                <>
                  <Row label="ABN Check" value={deposit.decision_signals.business_verification.abn} />
                  <Row label="ASIC Check" value={deposit.decision_signals.business_verification.asic} />
                  <Row label="Equifax Check" value={deposit.decision_signals.business_verification.equifax} />
                  <Row label="CW Check" value={deposit.decision_signals.business_verification.creditorwatch} />
                </>
              )}
            </div>
          )}

          {/* Reasons from decision log */}
          {decisionLog.length > 0 && decisionLog[0].reasons?.length > 0 && (
            <div className={`p-3 rounded-lg ${
              deposit.auto_decision === 'approved' ? 'bg-emerald-50' :
              deposit.auto_decision === 'rejected' ? 'bg-red-50' :
              'bg-amber-50'
            }`}>
              <p className={`text-xs font-semibold mb-1 ${
                deposit.auto_decision === 'approved' ? 'text-emerald-700' :
                deposit.auto_decision === 'rejected' ? 'text-red-700' :
                'text-amber-700'
              }`}>Reasons</p>
              <ul className={`text-xs space-y-0.5 ${
                deposit.auto_decision === 'approved' ? 'text-emerald-600' :
                deposit.auto_decision === 'rejected' ? 'text-red-600' :
                'text-amber-600'
              }`}>
                {decisionLog[0].reasons.map((r, i) => (
                  <li key={i}>&bull; {r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Business Verification */}
      {businessVerification && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Business Verification</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <Row label="ABN" value={businessVerification.abn} />
            <Row label="ACN" value={businessVerification.acn} />
            <Row label="Business Name" value={businessVerification.business_name} />
            <Row label="Role" value={businessVerification.applicant_role} />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
            <div>
              <p className="text-sm font-medium text-navy">Overall Result</p>
              <p className="text-xs text-gray-500">Score: {businessVerification.overall_score ?? '—'}/100</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              businessVerification.overall_status === 'passed' ? 'bg-emerald-100 text-emerald-700' :
              businessVerification.overall_status === 'partial' ? 'bg-amber-100 text-amber-700' :
              businessVerification.overall_status === 'failed' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {businessVerification.overall_status}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {Object.entries(BV_LAYER_LABELS).map(([key, meta]) => {
              const verified = businessVerification[meta.verifiedKey]
              const checked = businessVerification[meta.checkedKey]
              return (
                <div key={key} className="flex items-center justify-between p-2 text-sm">
                  <div className="flex items-center gap-2">
                    {verified === true ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : verified === false && checked ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-gray-700">{meta.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${verified ? 'text-emerald-600' : checked ? 'text-red-600' : 'text-gray-400'}`}>
                    {verified ? 'Passed' : checked ? 'Failed' : 'Not run'}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm border-t pt-3">
            <Row label="ABN Status" value={businessVerification.abn_status} />
            <Row label="ABN Entity" value={businessVerification.abn_entity_name} />
            <Row label="ASIC Company" value={businessVerification.asic_company_status} />
            <Row label="ASIC Director Match" value={businessVerification.asic_matched_director_name} />
            <Row label="Equifax Score" value={businessVerification.equifax_commercial_score} />
            <Row label="Equifax Defaults" value={businessVerification.equifax_payment_defaults} />
            <Row label="CW Risk Score" value={businessVerification.cw_risk_score} />
            <Row label="CW Risk Rating" value={businessVerification.cw_risk_rating} />
          </div>

          {businessVerification.failure_reasons?.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg">
              <p className="text-xs font-semibold text-red-700 mb-1">Failure Reasons</p>
              <ul className="text-xs text-red-600 space-y-0.5">
                {businessVerification.failure_reasons.map((r, i) => (
                  <li key={i}>&bull; {r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Review Actions */}
      {deposit.status === 'pending_review' && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Review</h2>

          {showRejectForm ? (
            <div className="space-y-3">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (optional)..."
                className="w-full h-24 p-3 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-coral-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectForm(false)}
                  disabled={reviewing}
                  className="h-10 px-4 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReview('reject')}
                  disabled={reviewing}
                  className="flex-1 h-10 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {reviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Confirm Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handleReview('approve')}
                disabled={reviewing}
                className="flex-1 h-10 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {reviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Approve
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={reviewing}
                className="flex-1 h-10 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  const display = value === null || value === undefined ? '—' : String(value)
  return (
    <div>
      <span className="text-gray-400">{label}</span>
      <p className="font-medium text-navy capitalize">{display}</p>
    </div>
  )
}
