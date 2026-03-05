import { Gift } from 'lucide-react'

export default function GiftCardRedeemForm({ item, onSubmit }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">{item.name}</p>
            <p className="text-xs text-gray-500">{item.retailer || 'Gift Card'}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">{item.description}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
        Your gift card code will be delivered via email within 24 hours of approval.
      </div>

      <button
        onClick={onSubmit}
        className="w-full h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <Gift className="w-4 h-4" />
        Redeem for {item.points_cost.toLocaleString('en-AU')} pts
      </button>
    </div>
  )
}
