import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, FileText, User, Briefcase, MapPin, Calendar,
  DollarSign, Users, Paperclip, Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import ApplicationStatusBadge from '../components/applications/ApplicationStatusBadge'

const STATUS_STEPS = ['submitted', 'under_review', 'approved']

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [application, setApplication] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const [{ data: app, error: appError }, { data: docs }] = await Promise.all([
          supabase.from('applications').select('*').eq('id', id).eq('user_id', user.id).single(),
          supabase.from('application_documents').select('*').eq('application_id', id),
        ])
        if (appError) throw appError
        setApplication(app)
        setDocuments(docs || [])
      } catch {
        navigate('/apply', { replace: true })
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
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    )
  }

  if (!application) return null

  const app = application
  const statusIndex = STATUS_STEPS.indexOf(app.status)
  const refs = app.refs || []

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        to="/apply"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to applications
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-navy mb-1">
            {app.property_address_line_1 || 'Application'}
            {app.property_suburb ? `, ${app.property_suburb}` : ''}
          </h1>
          <p className="text-sm text-gray-500">
            Submitted {app.submitted_at
              ? new Date(app.submitted_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
              : new Date(app.created_at).toLocaleDateString('en-AU')}
          </p>
        </div>
        <ApplicationStatusBadge status={app.status} />
      </div>

      {/* Status progress */}
      {app.status !== 'draft' && app.status !== 'cancelled' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    app.status === 'declined' && i > 0
                      ? 'bg-gray-200 text-gray-400'
                      : i <= statusIndex
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {app.status === 'declined' && i === statusIndex + 1 ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : i <= statusIndex ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-500 capitalize">{step.replace('_', ' ')}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${i < statusIndex ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Declined reason */}
      {app.status === 'declined' && app.decision_reason && (
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-700">Application Declined</p>
            <p className="text-sm text-red-600">{app.decision_reason}</p>
          </div>
        </div>
      )}

      {/* Approved CTA */}
      {app.status === 'approved' && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl mb-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-emerald-700">Application Approved!</p>
            <p className="text-sm text-emerald-600 mb-3">Congratulations! You can now apply for deposit aid.</p>
            <Link
              to="/deposit-aid"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Apply for Deposit Aid &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* Details sections */}
      <div className="space-y-4">
        {/* Property */}
        <Section icon={MapPin} title="Property">
          <Row label="Address" value={`${app.property_address_line_1 || '—'}, ${app.property_suburb || ''} ${app.property_state || ''} ${app.property_postcode || ''}`} />
          <Row label="Type" value={app.property_type} />
          <Row label="Deposit" value={app.deposit_amount ? `$${Number(app.deposit_amount).toLocaleString('en-AU')}` : '—'} />
          <Row label="Move-in" value={app.move_in_date ? new Date(app.move_in_date).toLocaleDateString('en-AU') : '—'} />
        </Section>

        {/* Personal */}
        <Section icon={User} title="Personal Details">
          <Row label="Name" value={`${app.first_name || ''} ${app.last_name || ''}`} />
          <Row label="Date of Birth" value={app.date_of_birth ? new Date(app.date_of_birth).toLocaleDateString('en-AU') : '—'} />
          <Row label="Address" value={`${app.address_line_1 || '—'}, ${app.suburb || ''} ${app.state || ''} ${app.postcode || ''}`} />
        </Section>

        {/* Employment */}
        <Section icon={Briefcase} title="Employment">
          <Row label="Status" value={app.employment_status} />
          {app.employer_name && <Row label="Employer" value={app.employer_name} />}
          {app.job_title && <Row label="Job Title" value={app.job_title} />}
          <Row label="Annual Income" value={app.annual_income ? `$${Number(app.annual_income).toLocaleString('en-AU')}` : '—'} />
        </Section>

        {/* References */}
        {refs.length > 0 && (
          <Section icon={Users} title="References">
            {refs.map((ref, i) => (
              <div key={i} className={i > 0 ? 'pt-2 border-t border-gray-100' : ''}>
                <p className="font-medium text-navy text-sm">{ref.name}</p>
                <p className="text-xs text-gray-500">{ref.relationship} · {ref.phone} · {ref.email}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Documents */}
        {documents.length > 0 && (
          <Section icon={Paperclip} title={`Documents (${documents.length})`}>
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-coral-500 shrink-0" />
                <span className="text-gray-700 truncate">{doc.file_name}</span>
                <span className="text-gray-400 text-xs shrink-0 capitalize">({doc.document_type?.replace('_', ' ')})</span>
              </div>
            ))}
          </Section>
        )}

        {/* Timeline */}
        <Section icon={Clock} title="Timeline">
          <div className="space-y-2 text-sm">
            {app.submitted_at && (
              <TimelineItem
                date={app.submitted_at}
                label="Application submitted"
              />
            )}
            {app.decision_at && (
              <TimelineItem
                date={app.decision_at}
                label={`Application ${app.decision_result || app.status}`}
              />
            )}
            <TimelineItem date={app.created_at} label="Application created" />
          </div>
        </Section>
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

function TimelineItem({ date, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-coral-400 shrink-0" />
      <span className="text-gray-700">{label}</span>
      <span className="text-gray-400 text-xs ml-auto">
        {new Date(date).toLocaleDateString('en-AU')}
      </span>
    </div>
  )
}
