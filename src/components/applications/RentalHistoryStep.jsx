import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { rentalHistorySchema } from '../../lib/validations'

export default function RentalHistoryStep({ data, onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rentalHistorySchema),
    defaultValues: {
      landlordName: data?.landlordName || '',
      landlordPhone: data?.landlordPhone || '',
      currentRent: data?.currentRent || '',
      leaseStartDate: data?.leaseStartDate || '',
      reasonForMoving: data?.reasonForMoving || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <h2 className="text-lg font-bold text-navy">Rental History</h2>

      <Field label="Current landlord / agent name" id="landlordName" error={errors.landlordName}>
        <input id="landlordName" type="text" {...register('landlordName')} className={inputClass} />
      </Field>

      <Field label="Landlord phone" id="landlordPhone" error={errors.landlordPhone}>
        <input id="landlordPhone" type="tel" placeholder="04XX XXX XXX" {...register('landlordPhone')} className={inputClass} />
      </Field>

      <Field label="Current rent ($/week)" id="currentRent" error={errors.currentRent}>
        <input id="currentRent" type="text" placeholder="500" {...register('currentRent')} className={inputClass} />
      </Field>

      <Field label="Lease start date" id="leaseStartDate" error={errors.leaseStartDate}>
        <input id="leaseStartDate" type="date" {...register('leaseStartDate')} className={inputClass} />
      </Field>

      <Field label="Reason for moving" id="reasonForMoving" error={errors.reasonForMoving}>
        <textarea
          id="reasonForMoving"
          rows={3}
          placeholder="Why are you looking for a new place?"
          {...register('reasonForMoving')}
          className={inputClass + ' h-auto py-3'}
        />
      </Field>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 h-12 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition-colors hover:bg-gray-50 cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 cursor-pointer"
        >
          Continue
        </button>
      </div>
    </form>
  )
}

const inputClass =
  'w-full h-11 px-4 rounded-xl border-2 border-gray-200 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-coral-500 focus:outline-none bg-white'

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  )
}
