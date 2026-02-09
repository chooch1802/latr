import { useState } from 'react'
import DocumentUpload from './DocumentUpload'

export default function DocumentsStep({ data, onNext, onBack }) {
  const [idDocs, setIdDocs] = useState(data?.idDocs || [])
  const [payslips, setPayslips] = useState(data?.payslips || [])
  const [bankStatements, setBankStatements] = useState(data?.bankStatements || [])
  const [refLetters, setRefLetters] = useState(data?.refLetters || [])
  const [error, setError] = useState(null)

  function handleNext() {
    if (idDocs.length === 0) {
      setError('Please upload at least one ID document')
      return
    }
    setError(null)
    onNext({ idDocs, payslips, bankStatements, refLetters })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-navy">Documents</h2>
      <p className="text-sm text-gray-500">
        Upload supporting documents for your application. ID is required; others are recommended.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>
      )}

      <DocumentUpload
        label="ID Document (required)"
        files={idDocs}
        onChange={setIdDocs}
      />

      <DocumentUpload
        label="Payslips (last 3 months)"
        files={payslips}
        onChange={setPayslips}
        multiple
      />

      <DocumentUpload
        label="Bank Statements"
        files={bankStatements}
        onChange={setBankStatements}
        multiple
      />

      <DocumentUpload
        label="Reference Letters"
        files={refLetters}
        onChange={setRefLetters}
        multiple
      />

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
          onClick={handleNext}
          className="flex-1 h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
