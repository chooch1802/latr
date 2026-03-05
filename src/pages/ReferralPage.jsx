import { useState, useEffect } from 'react'
import { ArrowLeft, Users, Clock, CheckCircle2, Gift } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getReferralCode, getReferrals } from '../lib/rewardsApi'
import ReferralShareCard from '../components/rewards/ReferralShareCard'

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: Clock },
  qualified: { label: 'Qualified', color: 'bg-blue-100 text-blue-700', icon: Users },
  rewarded: { label: 'Rewarded', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  expired: { label: 'Expired', color: 'bg-gray-100 text-gray-500', icon: Clock },
}

export default function ReferralPage() {
  const [code, setCode] = useState('')
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [refCode, refList] = await Promise.all([
          getReferralCode(),
          getReferrals(),
        ])
        setCode(refCode || '')
        setReferrals(refList)
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  const totalEarned = referrals
    .filter((r) => r.status === 'rewarded')
    .reduce((sum, r) => sum + (r.referrer_points_awarded || 0), 0)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/rewards" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">Refer a Friend</h1>
      </div>

      {/* Share card */}
      <div className="mb-6">
        <ReferralShareCard code={code} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-xl font-bold text-navy">{referrals.length}</p>
          <p className="text-xs text-gray-500">Invited</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-xl font-bold text-emerald-600">{referrals.filter((r) => r.status === 'rewarded').length}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-xl font-bold text-coral-500">{totalEarned.toLocaleString('en-AU')}</p>
          <p className="text-xs text-gray-500">Pts Earned</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <h2 className="text-sm font-semibold text-navy mb-3">How it works</h2>
        <div className="space-y-3">
          {[
            'Share your unique code with friends',
            'They sign up and complete onboarding',
            'You both earn bonus points!',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-coral-50 text-coral-500 text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-gray-600">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral list */}
      <h2 className="text-lg font-semibold text-navy mb-3">Your Referrals</h2>
      {referrals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <Gift className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No referrals yet. Share your code to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {referrals.map((ref) => {
            const config = statusConfig[ref.status] || statusConfig.pending
            const name = ref.referred
              ? `${ref.referred.first_name || ''} ${ref.referred.last_name || ''}`.trim() || 'User'
              : 'User'
            return (
              <div key={ref.id} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(ref.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.color}`}>
                  {config.label}
                </span>
                {ref.referrer_points_awarded > 0 && (
                  <span className="text-sm font-bold text-emerald-600">+{ref.referrer_points_awarded}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
