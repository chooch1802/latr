import { useState } from 'react'
import { Plane } from 'lucide-react'

export default function TravelTransferForm({ onSubmit }) {
  const [program, setProgram] = useState('qantas')
  const [memberId, setMemberId] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!memberId.trim()) return
    onSubmit({ program, memberId: memberId.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Loyalty Program</label>
        <div className="flex gap-2">
          {[
            { value: 'qantas', label: 'Qantas FF' },
            { value: 'velocity', label: 'Velocity' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setProgram(opt.value)}
              className={`flex-1 h-10 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                program === opt.value
                  ? 'bg-coral-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-1.5">
          Member Number
        </label>
        <input
          id="memberId"
          type="text"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          placeholder={program === 'qantas' ? 'e.g. 1234567890' : 'e.g. 1234567890'}
          className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={!memberId.trim()}
        className="w-full h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
      >
        <Plane className="w-4 h-4" />
        Transfer Points
      </button>
    </form>
  )
}
