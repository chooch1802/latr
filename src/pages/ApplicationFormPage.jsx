import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import PersonalInfoStep from '../components/applications/PersonalInfoStep'
import RentalHistoryStep from '../components/applications/RentalHistoryStep'
import EmploymentStep from '../components/applications/EmploymentStep'
import ReferencesStep from '../components/applications/ReferencesStep'
import DocumentsStep from '../components/applications/DocumentsStep'
import ReviewStep from '../components/applications/ReviewStep'

const steps = [
  { label: 'Personal', number: 1 },
  { label: 'Rental', number: 2 },
  { label: 'Employment', number: 3 },
  { label: 'References', number: 4 },
  { label: 'Documents', number: 5 },
]

export default function ApplicationFormPage() {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [applicationId, setApplicationId] = useState(null)

  // Accumulated form data across steps
  const [formData, setFormData] = useState({
    personalInfo: null,
    rentalHistory: null,
    employment: null,
    references: null,
    documents: null,
  })

  useEffect(() => {
    async function fetchProperty() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single()
      if (error) {
        navigate('/properties', { replace: true })
        return
      }
      setProperty(data)
      setLoading(false)
    }
    fetchProperty()
  }, [propertyId, navigate])

  function handlePersonalInfo(data) {
    setFormData((prev) => ({ ...prev, personalInfo: data }))
    setCurrentStep(2)
  }

  function handleRentalHistory(data) {
    setFormData((prev) => ({ ...prev, rentalHistory: data }))
    setCurrentStep(3)
  }

  function handleEmployment(data) {
    setFormData((prev) => ({ ...prev, employment: data }))
    setCurrentStep(4)
  }

  function handleReferences(data) {
    setFormData((prev) => ({ ...prev, references: data }))
    setCurrentStep(5)
  }

  function handleDocuments(data) {
    setFormData((prev) => ({ ...prev, documents: data }))
    setCurrentStep(6)
  }

  async function uploadFiles(files, folder) {
    const uploaded = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${folder}_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('application-documents')
        .upload(path, file)
      if (!error) {
        uploaded.push({ path, name: file.name, type: folder })
      }
    }
    return uploaded
  }

  async function handleSubmit() {
    try {
      setSubmitting(true)
      const { personalInfo, rentalHistory, employment, references, documents } = formData

      // Create application
      const { data: app, error: appError } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          status: 'submitted',
          current_step: 5,
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          date_of_birth: personalInfo.dateOfBirth,
          address_line_1: personalInfo.addressLine1,
          suburb: personalInfo.suburb,
          state: personalInfo.state,
          postcode: personalInfo.postcode,
          property_address_line_1: property.address,
          property_suburb: property.city,
          property_state: property.state,
          property_postcode: property.postcode,
          employment_status: employment.employmentStatus,
          employer_name: employment.employerName || null,
          job_title: employment.jobTitle || null,
          annual_income: Number(employment.annualIncome),
          deposit_amount: Number(property.rent_amount) * 4,
          move_in_date: property.available_date,
          property_type: property.property_type,
          rental_history: rentalHistory,
          refs: [references.employment, references.landlord, references.character].filter((r) => r?.name),
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (appError) throw appError

      // Upload documents
      const allDocs = []
      if (documents?.idDocs?.length) {
        const uploaded = await uploadFiles(documents.idDocs, 'id')
        allDocs.push(...uploaded.map((u) => ({ ...u, document_type: 'id' })))
      }
      if (documents?.payslips?.length) {
        const uploaded = await uploadFiles(documents.payslips, 'payslip')
        allDocs.push(...uploaded.map((u) => ({ ...u, document_type: 'payslip' })))
      }
      if (documents?.bankStatements?.length) {
        const uploaded = await uploadFiles(documents.bankStatements, 'bank_statement')
        allDocs.push(...uploaded.map((u) => ({ ...u, document_type: 'bank_statement' })))
      }
      if (documents?.refLetters?.length) {
        const uploaded = await uploadFiles(documents.refLetters, 'reference')
        allDocs.push(...uploaded.map((u) => ({ ...u, document_type: 'reference' })))
      }

      // Link documents to application
      if (allDocs.length > 0) {
        await supabase.from('application_documents').insert(
          allDocs.map((doc) => ({
            application_id: app.id,
            document_type: doc.document_type,
            file_url: doc.path,
            file_name: doc.name,
          }))
        )
      }

      // Update id_verified flag if ID was uploaded
      if (documents?.idDocs?.length) {
        await supabase
          .from('applications')
          .update({ id_verified: true })
          .eq('id', app.id)
      }

      setApplicationId(app.id)
      setSubmitted(true)
    } catch (err) {
      toast.error('Failed to submit application. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">Application Submitted!</h1>
        <p className="text-gray-500 mb-6">
          Your application for {property.address}, {property.city} has been submitted successfully.
          We&apos;ll review it and get back to you soon.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to={`/apply/${applicationId}`}
            className="h-11 px-6 bg-coral-500 text-white font-semibold rounded-xl inline-flex items-center transition-colors hover:bg-coral-600"
          >
            View Application
          </Link>
          <Link
            to="/apply"
            className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl inline-flex items-center transition-colors hover:bg-gray-50"
          >
            My Applications
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        to={`/properties/${propertyId}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to property
      </Link>

      {/* Property summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center gap-4">
        {property.images?.[0] && (
          <img
            src={`${property.images[0]}?w=80&h=80&fit=crop`}
            alt=""
            className="w-16 h-16 rounded-lg object-cover shrink-0"
          />
        )}
        <div>
          <p className="font-semibold text-navy">{property.address}, {property.city}</p>
          <p className="text-sm text-gray-500">
            ${Number(property.rent_amount).toLocaleString('en-AU')}/{property.rent_period} ·{' '}
            {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`} · {property.bathrooms} bath
          </p>
        </div>
      </div>

      {/* Progress stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep > step.number
                    ? 'bg-emerald-500 text-white'
                    : currentStep === step.number
                      ? 'bg-coral-500 text-white shadow-coral'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span className={`text-xs mt-1 font-medium ${currentStep >= step.number ? 'text-navy' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${currentStep > step.number ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {currentStep === 1 && (
          <PersonalInfoStep data={formData.personalInfo} onNext={handlePersonalInfo} />
        )}
        {currentStep === 2 && (
          <RentalHistoryStep
            data={formData.rentalHistory}
            onNext={handleRentalHistory}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <EmploymentStep
            data={formData.employment}
            onNext={handleEmployment}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <ReferencesStep
            data={formData.references}
            onNext={handleReferences}
            onBack={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 5 && (
          <DocumentsStep
            data={formData.documents}
            onNext={handleDocuments}
            onBack={() => setCurrentStep(4)}
          />
        )}
        {currentStep === 6 && (
          <ReviewStep
            formData={formData}
            property={property}
            onBack={() => setCurrentStep(5)}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  )
}
