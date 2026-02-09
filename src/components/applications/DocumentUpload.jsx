import { useCallback } from 'react'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']

export default function DocumentUpload({ label, files, onChange, multiple = false, accept = 'image/*,.pdf' }) {
  const handleFiles = useCallback((newFiles) => {
    const valid = Array.from(newFiles).filter((f) => {
      if (!ALLOWED_TYPES.includes(f.type)) return false
      if (f.size > MAX_FILE_SIZE) return false
      return true
    })
    if (multiple) {
      onChange([...files, ...valid])
    } else {
      onChange(valid.slice(0, 1))
    }
  }, [files, onChange, multiple])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  function removeFile(index) {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}

      {/* Uploaded files */}
      {files.length > 0 && (
        <div className="space-y-2 mb-3">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <FileText className="w-5 h-5 text-coral-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-red-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {(multiple || files.length === 0) && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`upload-${label}`).click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-coral-400 transition-colors cursor-pointer"
        >
          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            Drag & drop or <span className="text-coral-500 font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">PDF, JPG or PNG, max 5MB</p>
          <input
            id={`upload-${label}`}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  )
}
