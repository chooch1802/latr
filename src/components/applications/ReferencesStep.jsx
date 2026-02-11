import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { referencesSchema } from '../../lib/validations'

export default function ReferencesStep({ data, onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(referencesSchema),
    defaultValues: data || {
      employment: { name: '', phone: '', email: '', relationship: 'Employer' },
      landlord: { name: '', phone: '', email: '', relationship: 'Previous landlord' },
      character: { name: '', phone: '', email: '', relationship: '' },
    },
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <h2 className="text-lg font-bold text-navy">References</h2>

      {/* Employment reference */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Employment Reference *</h3>
        <ReferenceFields prefix="employment" register={register} errors={errors.employment} />
      </div>

      {/* Previous landlord */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Previous Landlord Reference *</h3>
        <ReferenceFields prefix="landlord" register={register} errors={errors.landlord} />
      </div>

      {/* Character reference */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Character Reference (optional)</h3>
        <ReferenceFields prefix="character" register={register} errors={errors.character} optional />
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
  'w-full h-11 px-4 rounded-xl border-2 border-gray-200 text-base text-gray-900 placeholder-gray-400 transition-colors focus:border-coral-500 focus:outline-none'

function ReferenceFields({ prefix, register, errors, optional }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <input
          type="text"
          placeholder="Full name"
          {...register(`${prefix}.name`)}
          className={inputClass}
        />
        {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input
          type="text"
          placeholder="Relationship"
          {...register(`${prefix}.relationship`)}
          className={inputClass}
        />
        {errors?.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship.message}</p>}
      </div>
      <div>
        <input
          type="tel"
          placeholder="Phone"
          {...register(`${prefix}.phone`)}
          className={inputClass}
        />
        {errors?.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register(`${prefix}.email`)}
          className={inputClass}
        />
        {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
    </div>
  )
}
