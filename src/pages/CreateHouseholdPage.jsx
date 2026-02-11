import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Check, Plus, X, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

const steps = [
  { label: 'Details', number: 1 },
  { label: 'Members', number: 2 },
  { label: 'Review', number: 3 },
]

export default function CreateHouseholdPage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const toast = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState(false)
  const [householdId, setHouseholdId] = useState(null)

  // Step 1: details
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [moveInDate, setMoveInDate] = useState('')
  const [leaseEndDate, setLeaseEndDate] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')

  // Step 2: members
  const [invites, setInvites] = useState([{ email: '', share: '' }])

  const myName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : user?.email || 'You'
  const totalMembers = invites.filter((i) => i.email).length + 1
  const equalShare = totalMembers > 0 ? Math.round((100 / totalMembers) * 100) / 100 : 100
  const myShare = 100 - invites.reduce((sum, i) => sum + (Number(i.share) || 0), 0)

  function addInvite() {
    setInvites([...invites, { email: '', share: '' }])
  }

  function removeInvite(idx) {
    setInvites(invites.filter((_, i) => i !== idx))
  }

  function updateInvite(idx, field, value) {
    setInvites(invites.map((inv, i) => (i === idx ? { ...inv, [field]: value } : inv)))
  }

  function autoSplitShares() {
    const validInvites = invites.filter((i) => i.email)
    const share = Math.round((100 / (validInvites.length + 1)) * 100) / 100
    setInvites(invites.map((inv) => (inv.email ? { ...inv, share: String(share) } : inv)))
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const { data: hh, error: hhErr } = await supabase
        .from('households')
        .insert({
          name,
          address: address || null,
          created_by: user.id,
          monthly_rent: monthlyRent ? Number(monthlyRent) : null,
          move_in_date: moveInDate || null,
          lease_end_date: leaseEndDate || null,
        })
        .select()
        .single()
      if (hhErr) throw hhErr

      // Add creator as admin member
      await supabase.from('household_members').insert({
        household_id: hh.id,
        user_id: user.id,
        role: 'admin',
        share_percentage: myShare > 0 ? myShare : equalShare,
        status: 'active',
        invited_email: user.email,
      })

      // Add invited members
      const validInvites = invites.filter((i) => i.email)
      if (validInvites.length > 0) {
        await supabase.from('household_members').insert(
          validInvites.map((inv) => ({
            household_id: hh.id,
            user_id: user.id, // Placeholder; real app would resolve or leave null
            role: 'member',
            share_percentage: Number(inv.share) || equalShare,
            status: 'invited',
            invited_email: inv.email,
          }))
        )
      }

      setHouseholdId(hh.id)
      setCreated(true)
    } catch (err) {
      toast.error('Failed to create household. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (created) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">Household Created!</h1>
        <p className="text-gray-500 mb-6">
          {invites.filter((i) => i.email).length > 0
            ? `Invitations have been sent to ${invites.filter((i) => i.email).length} roommate(s).`
            : 'You can invite roommates at any time from the manage page.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/household"
            className="h-11 px-6 bg-coral-500 text-white font-semibold rounded-xl inline-flex items-center gap-2 hover:bg-coral-600 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/household"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-coral-500 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Household Hub
      </Link>

      <h1 className="text-xl font-bold text-navy mb-6">Create Household</h1>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                currentStep > step.number ? 'bg-emerald-500 text-white'
                  : currentStep === step.number ? 'bg-coral-500 text-white shadow-coral'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span className={`text-xs mt-1 font-medium ${currentStep >= step.number ? 'text-navy' : 'text-gray-400'}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${currentStep > step.number ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Step 1: Details */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-navy mb-1">Household Details</h2>
            <p className="text-sm text-gray-500 mb-4">Basic information about your shared home.</p>

            <Field label="Household name" value={name} onChange={setName} placeholder="e.g. My Sydney Apartment" required />
            <Field label="Property address" value={address} onChange={setAddress} placeholder="123 George St, Sydney NSW 2000" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Move-in date" type="date" value={moveInDate} onChange={setMoveInDate} />
              <Field label="Lease end date" type="date" value={leaseEndDate} onChange={setLeaseEndDate} />
            </div>
            <Field label="Monthly rent" type="number" value={monthlyRent} onChange={setMonthlyRent} placeholder="e.g. 3414" prefix="$" />

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={!name}
              className="w-full h-11 mt-4 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Members */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-navy mb-1">Add Members</h2>
            <p className="text-sm text-gray-500 mb-4">Invite your roommates by email. Shares must total 100%.</p>

            {/* You (admin) */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
              <div className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {myName[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy">{myName} (You)</p>
                <p className="text-xs text-gray-400">Admin</p>
              </div>
              <div className="w-20 text-right">
                <span className="text-sm font-bold text-navy">{myShare.toFixed(1)}%</span>
              </div>
            </div>

            {/* Invites */}
            {invites.map((inv, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="email"
                  placeholder="roommate@email.com"
                  value={inv.email}
                  onChange={(e) => updateInvite(idx, 'email', e.target.value)}
                  className="flex-1 h-11 px-4 rounded-xl border border-gray-300 text-navy text-base focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                />
                <div className="relative w-20">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder={String(equalShare)}
                    value={inv.share}
                    onChange={(e) => updateInvite(idx, 'share', e.target.value)}
                    className="w-full h-11 px-3 pr-7 rounded-xl border border-gray-300 text-navy text-sm text-right focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeInvite(idx)}
                  className="w-9 h-9 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="flex gap-2 mt-3 mb-4">
              <button
                type="button"
                onClick={addInvite}
                className="text-sm font-medium text-coral-500 hover:text-coral-600 inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add another
              </button>
              <button
                type="button"
                onClick={autoSplitShares}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 ml-auto cursor-pointer"
              >
                Split equally
              </button>
            </div>

            {/* Total check */}
            {(() => {
              const total = myShare + invites.reduce((s, i) => s + (Number(i.share) || 0), 0)
              const ok = Math.abs(total - 100) < 0.1
              return (
                <div className={`text-sm p-3 rounded-xl mb-4 ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                  Total: {total.toFixed(1)}% {ok ? '— looks good!' : '— must equal 100%'}
                </div>
              )
            })()}

            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep(1)} className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                Back
              </button>
              <button type="button" onClick={() => setCurrentStep(3)} className="flex-1 h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors cursor-pointer">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-navy mb-1">Review & Create</h2>
            <p className="text-sm text-gray-500 mb-4">Confirm your household details.</p>

            <div className="space-y-2 mb-4">
              <Row label="Name" value={name} />
              {address && <Row label="Address" value={address} />}
              {moveInDate && <Row label="Move-in" value={new Date(moveInDate).toLocaleDateString('en-AU')} />}
              {leaseEndDate && <Row label="Lease ends" value={new Date(leaseEndDate).toLocaleDateString('en-AU')} />}
              {monthlyRent && <Row label="Monthly rent" value={`$${Number(monthlyRent).toLocaleString('en-AU')}`} />}
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mb-2">Members</h3>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <span className="text-navy font-medium">{myName} (You, Admin)</span>
                <span className="text-navy font-bold">{myShare.toFixed(1)}%</span>
              </div>
              {invites.filter((i) => i.email).map((inv, idx) => (
                <div key={idx} className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{inv.email}</span>
                  <span className="text-navy font-medium">{Number(inv.share).toFixed(1)}%</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setCurrentStep(2)} className="h-11 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Household'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, prefix, required }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</label>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-11 ${prefix ? 'pl-8' : 'pl-4'} pr-4 rounded-xl border border-gray-300 text-navy focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent`}
        />
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-navy font-medium">{value}</span>
    </div>
  )
}
