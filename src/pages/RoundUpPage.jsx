import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Loader2, Zap, Calendar, Clock, DollarSign, Settings, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { simulateAndSaveRoundups } from '../lib/roundupCalc'

const roundingLabels = { 1: '$1', 2: '$2', 5: '$5' }

export default function RoundUpPage() {
  const { user } = useAuth()
  const toast = useToast()
  const [settings, setSettings] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [toggling, setToggling] = useState(false)

  // Stats
  const [stats, setStats] = useState({ week: 0, month: 0, allTime: 0 })

  const fetchData = useCallback(async () => {
    try {
      const { data: settingsData } = await supabase
        .from('roundup_settings')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (!settingsData) {
        setLoading(false)
        return
      }

      setSettings(settingsData)

      const { data: txns } = await supabase
        .from('roundup_transactions')
        .select('*')
        .eq('roundup_setting_id', settingsData.id)
        .order('transaction_date', { ascending: false })
        .limit(50)

      setTransactions(txns || [])

      // Calculate stats
      const now = new Date()
      const weekAgo = new Date(now)
      weekAgo.setDate(weekAgo.getDate() - 7)
      const monthAgo = new Date(now)
      monthAgo.setMonth(monthAgo.getMonth() - 1)

      const allTxns = txns || []
      const weekTotal = allTxns
        .filter((t) => new Date(t.transaction_date) >= weekAgo)
        .reduce((sum, t) => sum + Number(t.roundup_amount), 0)
      const monthTotal = allTxns
        .filter((t) => new Date(t.transaction_date) >= monthAgo)
        .reduce((sum, t) => sum + Number(t.roundup_amount), 0)
      const allTimeTotal = Number(settingsData.total_contributed || 0)

      setStats({
        week: Math.round(weekTotal * 100) / 100,
        month: Math.round(monthTotal * 100) / 100,
        allTime: Math.round(allTimeTotal * 100) / 100,
      })
    } catch {
      // Settings don't exist — show empty state
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleToggle() {
    if (!settings) return
    setToggling(true)
    try {
      const newEnabled = !settings.enabled
      const { error } = await supabase
        .from('roundup_settings')
        .update({ enabled: newEnabled, updated_at: new Date().toISOString() })
        .eq('id', settings.id)

      if (error) throw error
      setSettings((s) => ({ ...s, enabled: newEnabled }))
      toast.success(newEnabled ? 'Round Up enabled' : 'Round Up paused')
    } catch {
      toast.error('Failed to update Round Up')
    } finally {
      setToggling(false)
    }
  }

  async function handleSimulate() {
    if (!settings) return
    setSimulating(true)
    try {
      await simulateAndSaveRoundups(
        supabase,
        user.id,
        settings.id,
        settings.deposit_application_id,
        settings.rounding_amount
      )
      toast.success('Simulated transactions generated!')
      await fetchData()
    } catch {
      toast.error('Failed to simulate transactions')
    } finally {
      setSimulating(false)
    }
  }

  async function handleRoundingChange(value) {
    if (!settings) return
    try {
      const { error } = await supabase
        .from('roundup_settings')
        .update({ rounding_amount: value, updated_at: new Date().toISOString() })
        .eq('id', settings.id)

      if (error) throw error
      setSettings((s) => ({ ...s, rounding_amount: value }))
      toast.success(`Rounding updated to $${value}`)
    } catch {
      toast.error('Failed to update rounding amount')
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-24 bg-gray-200 rounded-xl" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  // Empty state — no settings yet
  if (!settings) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-navy mb-6">Round Up</h1>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-lg font-semibold text-navy mb-2">Accelerate Your Deposit</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Round up your everyday purchases and put the spare change toward your deposit. A $4.50 coffee becomes $5.00, and $0.50 goes to your deposit.
          </p>
          <Link
            to="/round-up/setup"
            className="inline-flex items-center gap-2 h-11 px-6 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors"
          >
            Set Up Round Up
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Round Up</h1>
        <button
          type="button"
          onClick={handleToggle}
          disabled={toggling}
          className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: settings.enabled ? '#FF5A3D' : '#D1D5DB' }}
          aria-label={settings.enabled ? 'Disable Round Up' : 'Enable Round Up'}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              settings.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard icon={Clock} label="This Week" value={`$${stats.week.toFixed(2)}`} />
        <StatCard icon={Calendar} label="This Month" value={`$${stats.month.toFixed(2)}`} />
        <StatCard icon={TrendingUp} label="All Time" value={`$${stats.allTime.toFixed(2)}`} />
      </div>

      {/* Settings card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-coral-500" />
          <h2 className="text-sm font-semibold text-gray-700">Settings</h2>
        </div>
        <div className="space-y-3">
          {/* Rounding selector */}
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Rounding amount</p>
            <div className="flex gap-2">
              {[1, 2, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleRoundingChange(val)}
                  className={`flex-1 h-9 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    settings.rounding_amount === val
                      ? 'bg-coral-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className={`font-medium ${settings.enabled ? 'text-emerald-600' : 'text-gray-400'}`}>
              {settings.enabled ? 'Active' : 'Paused'}
            </span>
          </div>
          {settings.weekly_cap && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Weekly cap</span>
              <span className="text-navy font-medium">${Number(settings.weekly_cap).toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Simulate button */}
      <button
        type="button"
        onClick={handleSimulate}
        disabled={simulating || !settings.enabled}
        className="w-full h-11 bg-amber-50 text-amber-600 font-semibold rounded-xl hover:bg-amber-100 transition-colors mb-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {simulating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Simulating...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Simulate Transactions
          </>
        )}
      </button>

      {/* Transactions list */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 p-4 border-b border-gray-100">
          <DollarSign className="w-4 h-4 text-coral-500" />
          <h2 className="text-sm font-semibold text-gray-700">Recent Round Ups</h2>
          <span className="text-xs text-gray-400 ml-auto">{transactions.length} transactions</span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No round-up transactions yet. Click Simulate to generate demo transactions.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{txn.merchant_name}</p>
                  <p className="text-xs text-gray-400">{txn.category} · {new Date(txn.transaction_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">
                    ${Number(txn.original_amount).toFixed(2)} &rarr; ${Number(txn.rounded_amount).toFixed(2)}
                  </p>
                  <p className="text-sm font-semibold text-emerald-600">+${Number(txn.roundup_amount).toFixed(2)}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                  txn.status === 'applied'
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-gray-500 bg-gray-100'
                }`}>
                  {txn.status === 'applied' ? 'Applied' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
      <Icon className="w-4 h-4 text-coral-500 mx-auto mb-1" />
      <p className="text-lg font-bold text-navy">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}
