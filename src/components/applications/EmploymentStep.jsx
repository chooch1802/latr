import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { employmentSchema } from '../../lib/validations'

const EMPLOYMENT = [
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
]

export default function EmploymentStep({ data, onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      employmentStatus: data?.employmentStatus || '',
      employerName: data?.employerName || '',
      jobTitle: data?.jobTitle || '',
      annualIncome: data?.annualIncome || '',
    },
  })

  const employmentStatus = watch('employmentStatus')

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <h2 className="text-lg font-bold text-navy">Employment</h2>

      <Field label="Employment status" id="employmentStatus" error={errors.employmentStatus}>
        <select id="employmentStatus" {...register('employmentStatus')} className={inputClass}>
          <option value="">Select</option>
          {EMPLOYMENT.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
      </Field>

      {(employmentStatus === 'employed' || employmentStatus === 'self-employed') && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Employer / Business" id="employerName">
            <input id="employerName" type="text" {...register('employerName')} className={inputClass} />
          </Field>
          <Field label="Job title" id="jobTitle">
            <input id="jobTitle" type="text" {...register('jobTitle')} className={inputClass} />
          </Field>
        </div>
      )}

      <Field label="Annual income (AUD)" id="annualIncome" error={errors.annualIncome}>
        <input id="annualIncome" type="text" placeholder="65000" {...register('annualIncome')} className={inputClass} />
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
