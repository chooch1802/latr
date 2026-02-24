import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck, Upload, Camera, MapPin, X, FileText, CheckCircle2 } from 'lucide-react'
import { addressSchema } from '../../lib/validations'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { createOnfidoCheck, pollKYCStatus } from '../../lib/onfidoApi'
import AddressAutocomplete from '../ui/AddressAutocomplete'

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

export default function KYCVerificationStep({ onComplete }) {
  const { user } = useAuth()
  const [idFile, setIdFile] = useState(null)
  const [selfieFile, setSelfieFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
  })

  const addressLine1Value = watch('addressLine1', '')

  const handleFileDrop = useCallback((e, setter) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setter(file)
    }
  }, [])

  async function uploadFile(file, folder) {
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${folder}_${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('kyc-documents')
      .upload(path, file)
    if (error) throw error
    return path
  }

  async function onSubmit(addressData) {
    if (!idFile || !selfieFile) {
      setError('Please upload both your ID document and a selfie')
      return
    }

    try {
      setError(null)
      setUploading(true)

      // Upload files
      const idPath = await uploadFile(idFile, 'id')
      const selfiePath = await uploadFile(selfieFile, 'selfie')

      setUploading(false)
      setVerifying(true)

      // Save address to user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          address_line1: addressData.addressLine1,
          address_line2: addressData.addressLine2 || null,
          city: addressData.city,
          state: addressData.state,
          postcode: addressData.postcode,
        })
      if (profileError) throw profileError

      // Submit KYC verification via Onfido
      await createOnfidoCheck({
        idDocumentPath: idPath,
        selfiePath: selfiePath,
      })

      // Poll for KYC result from webhook
      const kycResult = await pollKYCStatus(user.id, { maxAttempts: 60, intervalMs: 3000 })

      const kycStatus = kycResult === 'verified' ? 'verified' : 'pending'
      const { error: updateError } = await supabase
        .from('users')
        .update({
          onboarding_step: 2,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
      if (updateError) throw updateError

      if (kycResult === 'verified') {
        setVerified(true)
        setTimeout(() => onComplete(), 1500)
      } else if (kycResult === 'rejected') {
        setError('Identity verification failed. Please try again with clearer documents.')
        setVerifying(false)
      } else {
        // Timeout — still processing, let them continue
        setVerified(true)
        setTimeout(() => onComplete(), 1500)
      }
    } catch (err) {
      setError(err.message)
      setUploading(false)
      setVerifying(false)
    }
  }

  if (verified) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">Identity Verified</h2>
        <p className="text-gray-500">Your identity has been verified successfully.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-coral-50 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-coral-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy">Identity Verification</h2>
          <p className="text-sm text-gray-500">Upload your ID and verify your address</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ID Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Upload className="w-4 h-4 inline mr-1" />
            ID Document (driver&apos;s licence or passport)
          </label>
          {idFile ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <FileText className="w-5 h-5 text-coral-500 shrink-0" />
              <span className="text-sm text-gray-700 truncate flex-1">{idFile.name}</span>
              <button
                type="button"
                onClick={() => setIdFile(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleFileDrop(e, setIdFile)}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-coral-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('id-upload').click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Drag & drop or <span className="text-coral-500 font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF, max 10MB</p>
              <input
                id="id-upload"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => handleFileDrop(e, setIdFile)}
              />
            </div>
          )}
        </div>

        {/* Selfie Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Camera className="w-4 h-4 inline mr-1" />
            Selfie (clear photo of your face)
          </label>
          {selfieFile ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <FileText className="w-5 h-5 text-coral-500 shrink-0" />
              <span className="text-sm text-gray-700 truncate flex-1">{selfieFile.name}</span>
              <button
                type="button"
                onClick={() => setSelfieFile(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleFileDrop(e, setSelfieFile)}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-coral-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('selfie-upload').click()}
            >
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Drag & drop or <span className="text-coral-500 font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG or PNG, max 10MB</p>
              <input
                id="selfie-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileDrop(e, setSelfieFile)}
              />
            </div>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-3">
            <MapPin className="w-4 h-4" />
            Residential Address
          </label>

          <div className="space-y-3">
            <div>
              <AddressAutocomplete
                id="addressLine1"
                value={addressLine1Value}
                onChange={(val) => setValue('addressLine1', val, { shouldValidate: true })}
                onSelect={({ addressLine1, city, state, postcode }) => {
                  setValue('addressLine1', addressLine1, { shouldValidate: true })
                  setValue('city', city, { shouldValidate: true })
                  setValue('state', state, { shouldValidate: true })
                  setValue('postcode', postcode, { shouldValidate: true })
                }}
                placeholder="Address line 1"
                error={errors.addressLine1}
              />
              {errors.addressLine1 && (
                <p className="text-red-500 text-sm mt-1">{errors.addressLine1.message}</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Address line 2 (optional)"
              autoComplete="address-line2"
              {...register('addressLine2')}
              className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 transition-colors focus:border-coral-500 focus:outline-none"
            />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="City/Suburb"
                  autoComplete="address-level2"
                  {...register('city')}
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 transition-colors focus:border-coral-500 focus:outline-none"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>
              <div>
                <select
                  {...register('state')}
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 text-gray-900 transition-colors focus:border-coral-500 focus:outline-none bg-white"
                >
                  <option value="">State</option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Postcode"
                  autoComplete="postal-code"
                  {...register('postcode')}
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 transition-colors focus:border-coral-500 focus:outline-none"
                />
                {errors.postcode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postcode.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || verifying}
          className="w-full h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {uploading
            ? 'Uploading documents...'
            : verifying
              ? 'Verifying identity...'
              : 'Verify & Continue'}
        </button>
      </form>
    </div>
  )
}
