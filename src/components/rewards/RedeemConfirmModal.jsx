import { useState } from 'react'
import { X, Loader2, AlertTriangle } from 'lucide-react'

export default function RedeemConfirmModal({ item, balance, onConfirm, onClose }) {
  const [confirming, setConfirming] = useState(false)
  const hasEnough = (balance?.available_points || 0) >= item.points_cost

  async function handleConfirm() {
    setConfirming(true)
    try {
      await onConfirm()
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <h2 className="text-lg font-bold text-navy mb-1">Confirm Redemption</h2>
        <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Item</span>
            <span className="font-medium text-navy">{item.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Points cost</span>
            <span className="font-bold text-coral-500">{item.points_cost.toLocaleString('en-AU')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Value</span>
            <span className="font-medium text-navy">${item.dollar_value}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
            <span className="text-gray-500">Your balance</span>
            <span className="font-medium text-navy">{(balance?.available_points || 0).toLocaleString('en-AU')} pts</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">After redemption</span>
            <span className="font-medium text-navy">
              {Math.max(0, (balance?.available_points || 0) - item.points_cost).toLocaleString('en-AU')} pts
            </span>
          </div>
        </div>

        {!hasEnough && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Insufficient points. You need {(item.points_cost - (balance?.available_points || 0)).toLocaleString('en-AU')} more.</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!hasEnough || confirming}
            className="flex-1 h-11 rounded-xl bg-coral-500 text-white text-sm font-semibold hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {confirming ? <><Loader2 className="w-4 h-4 animate-spin" /> Redeeming...</> : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
