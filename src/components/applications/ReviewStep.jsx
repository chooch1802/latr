import { useState } from 'react'
import { FileText, User, Users, Paperclip, CheckCircle2 } from 'lucide-react'

export default function ReviewStep({ formData, property, onBack, onSubmit, submitting }) {
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState(null)

  function handleSubmit() {
    if (!termsAccepted) {
      setError('You must accept the terms and conditions')
      return
    }
    setError(null)
    onSubmit()
  }

  const { personalInfo, references, documents } = formData
  const totalDocs = (documents?.idDocs?.length || 0) +
    (documents?.payslips?.length || 0) +
    (documents?.bankStatements?.length || 0) +
    (documents?.refLetters?.length || 0)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-navy">Review & Submit</h2>
      <p className="text-sm text-gray-500">
        Please review your application before submitting.
      </p>

      {/* Property */}
      {property && (
        <Section icon={FileText} title="Property">
          <p className="font-medium text-navy">
            {property.address}, {property.city} {property.state}
          </p>
          <p className="text-sm text-gray-500">
            ${Number(property.rent_amount).toLocaleString('en-AU')}/{property.rent_period}
          </p>
        </Section>
      )}

      {/* Personal info */}
      <Section icon={User} title="Personal Information">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <Row label="Name" value={`${personalInfo?.firstName} ${personalInfo?.lastName}`} />
          <Row label="Email" value={personalInfo?.email} />
          <Row label="Phone" value={personalInfo?.phone} />
          <Row label="DOB" value={personalInfo?.dateOfBirth} />
          <Row label="Address" value={`${personalInfo?.addressLine1}, ${personalInfo?.suburb} ${personalInfo?.state}`} />
          <Row label="Employment" value={personalInfo?.employmentStatus} />
          {personalInfo?.employerName && <Row label="Employer" value={personalInfo.employerName} />}
          <Row label="Annual Income" value={`$${Number(personalInfo?.annualIncome || 0).toLocaleString('en-AU')}`} />
        </div>
      </Section>

      {/* References */}
      <Section icon={Users} title="References">
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-navy">{references?.employment?.name}</p>
            <p className="text-gray-500">{references?.employment?.relationship} · {references?.employment?.phone}</p>
          </div>
          <div>
            <p className="font-medium text-navy">{references?.landlord?.name}</p>
            <p className="text-gray-500">{references?.landlord?.relationship} · {references?.landlord?.phone}</p>
          </div>
          {references?.character?.name && (
            <div>
              <p className="font-medium text-navy">{references.character.name}</p>
              <p className="text-gray-500">{references.character.relationship} · {references.character.phone}</p>
            </div>
          )}
        </div>
      </Section>

      {/* Documents */}
      <Section icon={Paperclip} title={`Documents (${totalDocs} file${totalDocs !== 1 ? 's' : ''})`}>
        <div className="space-y-1 text-sm">
          {documents?.idDocs?.map((f, i) => <DocRow key={`id-${i}`} name={f.name} type="ID" />)}
          {documents?.payslips?.map((f, i) => <DocRow key={`pay-${i}`} name={f.name} type="Payslip" />)}
          {documents?.bankStatements?.map((f, i) => <DocRow key={`bank-${i}`} name={f.name} type="Bank Statement" />)}
          {documents?.refLetters?.map((f, i) => <DocRow key={`ref-${i}`} name={f.name} type="Reference" />)}
        </div>
      </Section>

      {/* Terms */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>
      )}

      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
        <input
          id="terms"
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-coral-500 focus:ring-coral-500"
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I confirm the information provided is true and accurate. I agree to the{' '}
          <a href="/terms" className="text-coral-500 font-medium">Terms of Service</a> and authorize
          LATR to verify this information with the relevant parties.
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition-colors hover:bg-gray-50 cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-coral-500" />
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>{' '}
      <span className="text-navy">{value || '—'}</span>
    </div>
  )
}

function DocRow({ name, type }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
      <span className="text-gray-700 truncate">{name}</span>
      <span className="text-gray-400 text-xs shrink-0">({type})</span>
    </div>
  )
}
