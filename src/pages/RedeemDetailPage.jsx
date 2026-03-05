import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getRewardBalance, redeemPoints } from '../lib/rewardsApi'
import { useToast } from '../contexts/ToastContext'
import RedeemConfirmModal from '../components/rewards/RedeemConfirmModal'
import TravelTransferForm from '../components/rewards/TravelTransferForm'
import GiftCardRedeemForm from '../components/rewards/GiftCardRedeemForm'

export default function RedeemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [item, setItem] = useState(null)
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [redeemData, setRedeemData] = useState({})

  useEffect(() => {
    async function load() {
      try {
        const [{ data: catalogItem }, bal] = await Promise.all([
          supabase.from('redemption_catalog').select('*').eq('id', id).single(),
          getRewardBalance(),
        ])
        setItem(catalogItem)
        setBalance(bal)
      } catch {
        // Item not found
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleRedeem() {
    try {
      await redeemPoints({
        catalogItemId: item.id,
        category: item.category,
        pointsSpent: item.points_cost,
        dollarValue: item.dollar_value,
        ...redeemData,
      })
      toast.success('Redemption submitted! Check your redemptions for status.')
      navigate('/rewards/redemptions')
    } catch (err) {
      toast.error(err.message || 'Failed to redeem')
    }
  }

  function handleTravelSubmit(data) {
    setRedeemData({ travelProgram: data.program, travelMemberId: data.memberId })
    setShowConfirm(true)
  }

  function handleGenericRedeem() {
    setRedeemData({})
    setShowConfirm(true)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-500">Item not found.</p>
        <Link to="/rewards/redeem" className="text-coral-500 text-sm font-medium mt-2 inline-block">
          Back to catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/rewards/redeem" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">{item.name}</h1>
      </div>

      {/* Item details */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-coral-500">{item.points_cost.toLocaleString('en-AU')}</p>
            <p className="text-xs text-gray-400">Points required</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-navy">${item.dollar_value}</p>
            <p className="text-xs text-gray-400">Value</p>
          </div>
        </div>
      </div>

      {/* Category-specific forms */}
      {item.category === 'travel' ? (
        <TravelTransferForm onSubmit={handleTravelSubmit} />
      ) : item.category === 'gift_card' ? (
        <GiftCardRedeemForm item={item} onSubmit={handleGenericRedeem} />
      ) : (
        <button
          onClick={handleGenericRedeem}
          disabled={(balance?.available_points || 0) < item.points_cost}
          className="w-full h-11 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Redeem for {item.points_cost.toLocaleString('en-AU')} pts
        </button>
      )}

      {/* Confirm modal */}
      {showConfirm && (
        <RedeemConfirmModal
          item={item}
          balance={balance}
          onConfirm={handleRedeem}
          onClose={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}
