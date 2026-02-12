import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalInfoSchema } from '../../lib/validations'
import { useAuth } from '../../contexts/AuthContext'
import AddressAutocomplete from '../ui/AddressAutocomplete'

const STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

export default function PersonalInfoStep({ data, onNext }) {
  const { profile, user } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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
    },
  })

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
        <AddressAutocomplete
          id="addressLine1"
          value={watch('addressLine1', '')}
          onChange={(val) => setValue('addressLine1', val, { shouldValidate: true })}
          onSelect={({ addressLine1, city, state, postcode }) => {
            setValue('addressLine1', addressLine1, { shouldValidate: true })
            setValue('suburb', city, { shouldValidate: true })
            setValue('state', state, { shouldValidate: true })
            setValue('postcode', postcode, { shouldValidate: true })
          }}
          placeholder="123 Example St"
          error={errors.addressLine1}
          className={inputClass}
        />
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
