import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, LogOut, ShieldCheck, ShieldAlert, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { profileSchema, addressSchema } from '../lib/settingsValidations'

const kycBadges = {
  verified: { label: 'Verified', icon: ShieldCheck, cls: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Pending', icon: Clock, cls: 'bg-yellow-50 text-yellow-700' },
  failed: { label: 'Failed', icon: ShieldAlert, cls: 'bg-red-50 text-red-600' },
}

export default function SettingsPage() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [addressData, setAddressData] = useState(null)
  const [preferences, setPreferences] = useState(null)
  const [loadingAddress, setLoadingAddress] = useState(true)
  const [loadingPrefs, setLoadingPrefs] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [addressSuccess, setAddressSuccess] = useState(false)

  // Profile form
  const {
    register: regProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
    },
  })

  // Address form
  const {
    register: regAddress,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors },
    reset: resetAddress,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postcode: '',
    },
  })

  // Prefill profile form when profile loads
  useEffect(() => {
    if (profile) {
      resetProfile({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        dateOfBirth: profile.date_of_birth || '',
      })
    }
  }, [profile, resetProfile])

  // Fetch address data
  useEffect(() => {
    async function fetchAddress() {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setAddressData(data)
      if (data) {
        resetAddress({
          addressLine1: data.address_line1 || '',
          addressLine2: data.address_line2 || '',
          city: data.city || '',
          state: data.state || '',
          postcode: data.postcode || '',
        })
      }
      setLoadingAddress(false)
    }
    fetchAddress()
  }, [user.id, resetAddress])

  // Fetch notification preferences
  useEffect(() => {
    async function fetchPrefs() {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setPreferences(data || {
        bill_reminders: true,
        application_updates: true,
        household_activity: true,
        payment_reminders: true,
      })
      setLoadingPrefs(false)
    }
    fetchPrefs()
  }, [user.id])

  async function onSaveProfile(values) {
    setSavingProfile(true)
    setProfileSuccess(false)
    await supabase
      .from('users')
      .update({
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        date_of_birth: values.dateOfBirth,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
    await refreshProfile()
    setSavingProfile(false)
    setProfileSuccess(true)
    setTimeout(() => setProfileSuccess(false), 3000)
  }

  async function onSaveAddress(values) {
    setSavingAddress(true)
    setAddressSuccess(false)
    const payload = {
      address_line1: values.addressLine1,
      address_line2: values.addressLine2 || null,
      city: values.city,
      state: values.state,
      postcode: values.postcode,
    }
    if (addressData) {
      await supabase.from('user_profiles').update(payload).eq('id', user.id)
    } else {
      await supabase.from('user_profiles').insert({ id: user.id, ...payload })
    }
    setSavingAddress(false)
    setAddressSuccess(true)
    setTimeout(() => setAddressSuccess(false), 3000)
  }

  async function togglePref(key) {
    const updated = { ...preferences, [key]: !preferences[key] }
    setPreferences(updated)
    setSavingPrefs(true)

    const payload = {
      bill_reminders: updated.bill_reminders,
      application_updates: updated.application_updates,
      household_activity: updated.household_activity,
      payment_reminders: updated.payment_reminders,
      updated_at: new Date().toISOString(),
    }

    if (preferences.id) {
      await supabase.from('user_preferences').update(payload).eq('user_id', user.id)
    } else {
      await supabase.from('user_preferences').insert({ user_id: user.id, ...payload })
      // Refetch to get the id
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setPreferences(data)
    }
    setSavingPrefs(false)
  }

  const kyc = kycBadges[profile?.kyc_status] || kycBadges.pending
  const KycIcon = kyc.icon

  const inputCls =
    'w-full h-10 px-3 rounded-xl border border-gray-300 text-navy text-base focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent'
  const labelCls = 'block text-sm text-gray-500 mb-1'
  const errorCls = 'text-xs text-red-500 mt-1'

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-navy mb-6">Settings</h1>

      {/* Profile Section */}
      <form onSubmit={handleProfileSubmit(onSaveProfile)} className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Profile</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First name</label>
              <input {...regProfile('firstName')} className={inputCls} />
              {profileErrors.firstName && <p className={errorCls}>{profileErrors.firstName.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Last name</label>
              <input {...regProfile('lastName')} className={inputCls} />
              {profileErrors.lastName && <p className={errorCls}>{profileErrors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input {...regProfile('phone')} className={inputCls} />
            {profileErrors.phone && <p className={errorCls}>{profileErrors.phone.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Date of birth</label>
            <input type="date" {...regProfile('dateOfBirth')} className={inputCls} />
            {profileErrors.dateOfBirth && <p className={errorCls}>{profileErrors.dateOfBirth.message}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            type="submit"
            disabled={savingProfile}
            className="h-10 px-5 bg-coral-500 text-white font-medium rounded-xl text-sm hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
          >
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </button>
          {profileSuccess && <span className="text-sm text-emerald-600">Saved!</span>}
        </div>
      </form>

      {/* Address Section */}
      <form onSubmit={handleAddressSubmit(onSaveAddress)} className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Address</h2>
        {loadingAddress ? (
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Address line 1</label>
              <input {...regAddress('addressLine1')} className={inputCls} />
              {addressErrors.addressLine1 && <p className={errorCls}>{addressErrors.addressLine1.message}</p>}
            </div>
            <div>
              <label className={labelCls}>Address line 2</label>
              <input {...regAddress('addressLine2')} className={inputCls} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>City / Suburb</label>
                <input {...regAddress('city')} className={inputCls} />
                {addressErrors.city && <p className={errorCls}>{addressErrors.city.message}</p>}
              </div>
              <div>
                <label className={labelCls}>State</label>
                <select {...regAddress('state')} className={inputCls}>
                  <option value="">Select</option>
                  {['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {addressErrors.state && <p className={errorCls}>{addressErrors.state.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Postcode</label>
                <input {...regAddress('postcode')} className={inputCls} />
                {addressErrors.postcode && <p className={errorCls}>{addressErrors.postcode.message}</p>}
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="submit"
            disabled={savingAddress || loadingAddress}
            className="h-10 px-5 bg-coral-500 text-white font-medium rounded-xl text-sm hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-2"
          >
            {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Address
          </button>
          {addressSuccess && <span className="text-sm text-emerald-600">Saved!</span>}
        </div>
      </form>

      {/* Account Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Account</h2>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Email</label>
            <input value={user?.email || ''} disabled className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">KYC Status:</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${kyc.cls}`}>
              <KycIcon className="w-3.5 h-3.5" />
              {kyc.label}
            </span>
          </div>
        </div>
        <button
          onClick={signOut}
          className="mt-4 h-10 px-5 border-2 border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Notification Preferences</h2>
        {loadingPrefs ? (
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <div className="space-y-3">
            {[
              { key: 'bill_reminders', label: 'Bill Reminders', desc: 'Get notified about upcoming and new bills' },
              { key: 'application_updates', label: 'Application Updates', desc: 'Updates on your rental applications' },
              { key: 'household_activity', label: 'Household Activity', desc: 'Member joins, invitations, and changes' },
              { key: 'payment_reminders', label: 'Payment Reminders', desc: 'Deposit aid payment due reminders' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-navy">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => togglePref(key)}
                  disabled={savingPrefs}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    preferences[key] ? 'bg-coral-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      preferences[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
