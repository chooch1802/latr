import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, UserPlus, Save, Loader2, Trash2, Shield } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { createNotification } from '../lib/notifications'

export default function ManageHouseholdPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [household, setHousehold] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteShare, setInviteShare] = useState('')
  const [inviting, setInviting] = useState(false)

  // Editable fields
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [leaseEndDate, setLeaseEndDate] = useState('')

  const isAdmin = members.find((m) => m.user_id === user.id)?.role === 'admin'

  useEffect(() => {
    async function fetch() {
      const [{ data: hh, error: hhErr }, { data: mems }] = await Promise.all([
        supabase.from('households').select('*').eq('id', id).single(),
        supabase.from('household_members').select('*').eq('household_id', id).neq('status', 'left'),
      ])
      if (hhErr) {
        navigate('/household', { replace: true })
        return
      }
      setHousehold(hh)
      setMembers(mems || [])
      setName(hh.name || '')
      setAddress(hh.address || '')
      setMonthlyRent(hh.monthly_rent ? String(hh.monthly_rent) : '')
      setLeaseEndDate(hh.lease_end_date || '')
      setLoading(false)
    }
    fetch()
  }, [id, navigate, user.id])

  async function handleSave() {
    setSaving(true)
    await supabase
      .from('households')
      .update({
        name,
        address: address || null,
        monthly_rent: monthlyRent ? Number(monthlyRent) : null,
        lease_end_date: leaseEndDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
    setSaving(false)
    toast.success('Household details saved!')
  }

  async function handleInvite() {
    if (!inviteEmail) return
    setInviting(true)
    await supabase.from('household_members').insert({
      household_id: id,
      user_id: user.id, // Placeholder
      role: 'member',
      share_percentage: Number(inviteShare) || 0,
      status: 'invited',
      invited_email: inviteEmail,
    })
    setMembers([...members, {
      id: crypto.randomUUID(),
      household_id: id,
      user_id: user.id,
      role: 'member',
      share_percentage: Number(inviteShare) || 0,
      status: 'invited',
      invited_email: inviteEmail,
      joined_at: new Date().toISOString(),
    }])
    // Notify invitee if they have an account
    const { data: invitee } = await supabase
      .from('users')
      .select('id')
      .eq('email', inviteEmail)
      .single()
    if (invitee) {
      await createNotification(
        invitee.id,
        'household_invite',
        `You've been invited to ${name || 'a household'}`,
        `You've been invited to join a household. Check your Hub for details.`,
        { link: '/household' }
      )
    }

    toast.success('Invitation sent!')
    setInviteEmail('')
    setInviteShare('')
    setInviting(false)
  }

  async function handleRemoveMember(memberId) {
    await supabase
      .from('household_members')
      .update({ status: 'left' })
      .eq('id', memberId)
    setMembers(members.filter((m) => m.id !== memberId))
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-48 bg-gray-200 rounded-xl" />
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
        Back to Hub
      </Link>

      <h1 className="text-xl font-bold text-navy mb-6">Manage Household</h1>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Household Details</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-gray-300 text-navy text-base focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-gray-300 text-navy text-base focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Monthly rent</label>
              <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-gray-300 text-navy text-base focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Lease end date</label>
              <input type="date" value={leaseEndDate} onChange={(e) => setLeaseEndDate(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-gray-300 text-navy text-base focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent" />
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 h-10 px-5 bg-coral-500 text-white font-medium rounded-xl text-sm hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Members</h2>
        <div className="space-y-2 mb-4">
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-coral-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {(m.invited_email?.[0] || '?').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy truncate">{m.invited_email || 'Member'}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  {m.role === 'admin' && <Shield className="w-3 h-3" />}
                  {m.role} · {m.share_percentage || 0}% · {m.status}
                </p>
              </div>
              {isAdmin && m.user_id !== user.id && m.role !== 'admin' && (
                <button
                  onClick={() => handleRemoveMember(m.id)}
                  className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Invite form */}
        {isAdmin && (
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Invite new member</h3>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="email@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl border border-gray-300 text-navy text-base focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
              />
              <div className="relative w-20">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="%"
                  value={inviteShare}
                  onChange={(e) => setInviteShare(e.target.value)}
                  className="w-full h-10 px-3 pr-7 rounded-xl border border-gray-300 text-navy text-sm text-right focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
              </div>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail || inviting}
                className="h-10 px-4 bg-coral-500 text-white font-medium rounded-xl text-sm hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-1"
              >
                {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
