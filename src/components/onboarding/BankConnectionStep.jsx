import { useState } from 'react'
import { Landmark, CheckCircle2, ArrowRight, DollarSign, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { initiateBankConnection, fetchBankAccounts, fetchTransactions } from '../../lib/mockApis'

export default function BankConnectionStep({ onComplete }) {
  const { user } = useAuth()
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleConnect() {
    try {
      setError(null)
      setConnecting(true)

      // Initiate bank connection (mock)
      const connection = await initiateBankConnection(user.id)

      // Fetch accounts
      const { accounts: accts } = await fetchBankAccounts(connection.connectionId)
      setAccounts(accts)

      // Fetch transactions for first account
      if (accts.length > 0) {
        const { transactions: txns } = await fetchTransactions(accts[0].id)
        setTransactions(txns)
      }

      // Save connection to database
      const { error: dbError } = await supabase
        .from('bank_connections')
        .insert({
          user_id: user.id,
          basiq_connection_id: connection.connectionId,
          institution_name: accts[0]?.institution || 'Unknown',
          account_name: accts[0]?.name || 'Primary Account',
          account_number: accts[0]?.accountNumber || '',
          status: 'active',
        })
      if (dbError) throw dbError

      setConnected(true)
      setConnecting(false)
    } catch (err) {
      setError(err.message)
      setConnecting(false)
    }
  }

  async function handleContinue() {
    try {
      setSaving(true)
      const { error: updateError } = await supabase
        .from('users')
        .update({
          onboarding_step: 3,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
      if (updateError) throw updateError
      await onComplete()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <Landmark className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy">Connect Your Bank</h2>
          <p className="text-sm text-gray-500">Securely link your bank account for assessment</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
      )}

      {!connected ? (
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Landmark className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">Secure Bank Connection</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            We use bank-level encryption to securely connect to your bank.
            We can only read your data — we can never move your money.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="h-12 px-8 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-2"
            >
              {connecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>Connect Bank Account</>
              )}
            </button>
            <p className="text-xs text-gray-400">Powered by Basiq — read-only access</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Connected success */}
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-sm font-medium text-emerald-700">Bank connected successfully</span>
          </div>

          {/* Account summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Total Balance</span>
              </div>
              <p className="text-xl font-bold text-navy">
                ${totalBalance.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Accounts</span>
              </div>
              <p className="text-xl font-bold text-navy">{accounts.length}</p>
            </div>
          </div>

          {/* Accounts list */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Accounts</h3>
            <div className="space-y-2">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-navy">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.institution} · {account.accountNumber}</p>
                  </div>
                  <p className="text-sm font-semibold text-navy">
                    ${account.balance.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          {transactions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Transactions</h3>
              <div className="space-y-1">
                {transactions.slice(0, 5).map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-sm text-navy">{txn.description}</p>
                      <p className="text-xs text-gray-400">{txn.date}</p>
                    </div>
                    <p className={`text-sm font-medium ${txn.amount >= 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
                      {txn.amount >= 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={saving}
            className="w-full h-12 bg-coral-500 text-white font-semibold rounded-xl transition-colors hover:bg-coral-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2"
          >
            {saving ? 'Saving...' : (
              <>Continue to Assessment <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
