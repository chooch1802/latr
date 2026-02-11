import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalInfoSchema } from '../../lib/validations'
import { useAuth } from '../../contexts/AuthContext'

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']
const EMPLOYMENT = [
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'student', label: 'Student' },
  { value: 'retired', label: 'Retired' },
]

export default function PersonalInfoStep({ data, onNext }) {
  const { profile, user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: data?.firstName || profile?.first_name || '',
      lastName: data?.lastName || profile?.last_name || '',
      dateOfBirth: data?.dateOfBirth || profile?.date_of_birth || '',
      phone: data?.phone || profile?.phone || '',
      email: data?.email || user?.email || '',
      addressLine1: data?.addressLine1 || '',
      suburb: data?.suburb || '',
      state: data?.state || '',
      postcode: data?.postcode || '',
      employmentStatus: data?.employmentStatus || '',
      employerName: data?.employerName || '',
      jobTitle: data?.jobTitle || '',
      annualIncome: data?.annualIncome || '',
    },
  })

  const employmentStatus = watch('employmentStatus')

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <h2 className="text-lg font-bold text-navy">Personal Information</h2>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" id="firstName" error={errors.firstName}>
          <input id="firstName" type="text" {...register('firstName')} className={inputClass} />
        </Field>
        <Field label="Last name" id="lastName" error={errors.lastName}>
          <input id="lastName" type="text" {...register('lastName')} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date of birth" id="dateOfBirth" error={errors.dateOfBirth}>
          <input id="dateOfBirth" type="date" {...register('dateOfBirth')} className={inputClass} />
        </Field>
        <Field label="Phone" id="phone" error={errors.phone}>
          <input id="phone" type="tel" placeholder="04XX XXX XXX" {...register('phone')} className={inputClass} />
        </Field>
      </div>

      <Field label="Email" id="email" error={errors.email}>
        <input id="email" type="email" {...register('email')} className={inputClass} />
      </Field>

      <hr className="border-gray-200" />
      <h3 className="text-sm font-semibold text-gray-700">Current Address</h3>

      <Field label="Address" id="addressLine1" error={errors.addressLine1}>
        <input id="addressLine1" type="text" placeholder="123 Example St" {...register('addressLine1')} className={inputClass} />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Suburb" id="suburb" error={errors.suburb}>
          <input id="suburb" type="text" {...register('suburb')} className={inputClass} />
        </Field>
        <Field label="State" id="state" error={errors.state}>
          <select id="state" {...register('state')} className={inputClass}>
            <option value="">Select</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Postcode" id="postcode" error={errors.postcode}>
          <input id="postcode" type="text" {...register('postcode')} className={inputClass} />
        </Field>
      </div>

      <hr className="border-gray-200" />
      <h3 className="text-sm font-semibold text-gray-700">Employment</h3>

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

      <button
        type="submit"
        className="w-full h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 cursor-pointer"
      >
        Continue
      </button>
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
