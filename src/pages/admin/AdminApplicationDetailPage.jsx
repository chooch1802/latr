import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, FileText, Loader2, AlertTriangle, Building2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../contexts/ToastContext'

const BV_LAYER_LABELS = {
  abn: { label: 'ABN Lookup', verifiedKey: 'abn_verified', checkedKey: 'abn_checked_at' },
  asic: { label: 'ASIC Directors', verifiedKey: 'asic_verified', checkedKey: 'asic_checked_at' },
  equifax: { label: 'Equifax Commercial', verifiedKey: 'equifax_verified', checkedKey: 'equifax_checked_at' },
  cw: { label: 'CreditorWatch', verifiedKey: 'cw_verified', checkedKey: 'cw_checked_at' },
}

export default function AdminApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [app, setApp] = useState(null)
  const [docs, setDocs] = useState([])
  const [businessVerification, setBusinessVerification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  useEffect(() => {
    async function load() {
      const [appRes, docsRes] = await Promise.all([
        supabase
          .from('applications')
          .select('*, users:user_id (first_name, last_name, email, phone, kyc_status)')
          .eq('id', id)
          .single(),
        supabase
          .from('application_documents')
          .select('*')
          .eq('application_id', id),
      ])
      if (appRes.error) {
        navigate('/admin/applications', { replace: true })
        return
      }
      setApp(appRes.data)
      setDocs(docsRes.data || [])

      // Check for business verification via deposit_applications
      const { data: depApps } = await supabase
        .from('deposit_applications')
        .select('id, applicant_type')
        .eq('application_id', id)
        .eq('applicant_type', 'business')
        .limit(1)

      if (depApps && depApps.length > 0) {
        const { data: bv } = await supabase
          .from('business_verifications')
          .select('*')
          .eq('deposit_application_id', depApps[0].id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (bv) setBusinessVerification(bv)
      }

      setLoading(false)
    }
    load()
  }, [id, navigate])

  async function handleReview(action) {
    setReviewing(true)
    try {
      const res = await supabase.functions.invoke('admin-review-application', {
        body: {
          applicationId: id,
          action,
          reason: action === 'reject' ? rejectReason : undefined,
        },
      })
      if (res.error) throw new Error(res.error.message)
      toast.success(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      // Reload
      const { data } = await supabase.from('applications').select('*, users:user_id (first_name, last_name, email, phone, kyc_status)').eq('id', id).single()
      setApp(data)
      setShowRejectForm(false)
    } catch (err) {
      toast.error(err.message || 'Failed to review application')
    } finally {
      setReviewing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-60 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  const user = app.users || {}
  const isPending = app.status === 'submitted' || app.status === 'draft'

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/admin/applications" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Applications
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-navy">Application Review</h1>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
          app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {app.status}
        </span>
      </div>

      {/* Applicant info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Applicant</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Name" value={`${user.first_name || ''} ${user.last_name || ''}`} />
          <Row label="Email" value={user.email} />
          <Row label="Phone" value={user.phone} />
          <Row label="KYC Status" value={user.kyc_status} />
        </div>
      </div>

      {/* Property details */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Property</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row label="Address" value={`${app.property_address_line_1 || ''} ${app.property_suburb || ''}`} />
          <Row label="State" value={app.property_state} />
          <Row label="Rent" value={app.weekly_rent ? `$${app.weekly_rent}/week` : '—'} />
          <Row label="Deposit" value={`$${Number(app.deposit_amount || 0).toLocaleString('en-AU')}`} />
          <Row label="Lease Start" value={app.lease_start_date} />
          <Row label="Lease Duration" value={app.lease_duration ? `${app.lease_duration} months` : '—'} />
        </div>
      </div>

      {/* Documents */}
      {docs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Documents</h2>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 flex-1">{doc.document_type || doc.file_name || 'Document'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Verification Card */}
      {businessVerification && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Business Verification</h2>
          </div>

          {/* Business identity */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <Row label="ABN" value={businessVerification.abn} />
            <Row label="ACN" value={businessVerification.acn} />
            <Row label="Business Name" value={businessVerification.business_name} />
            <Row label="Role" value={businessVerification.applicant_role} />
          </div>

          {/* Overall status */}
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

          {/* Layer results */}
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

          {/* Layer details */}
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

          {/* Failure reasons */}
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

      {/* Review actions */}
      {isPending && (
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
