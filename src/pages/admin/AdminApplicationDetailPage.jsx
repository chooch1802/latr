import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, XCircle, FileText, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../contexts/ToastContext'

export default function AdminApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [app, setApp] = useState(null)
  const [docs, setDocs] = useState([])
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
  return (
    <div>
      <span className="text-gray-400">{label}</span>
      <p className="font-medium text-navy capitalize">{value || '—'}</p>
    </div>
  )
}
