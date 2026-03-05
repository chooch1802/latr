import { Star, Gift, MapPin, Zap } from 'lucide-react'

const iconMap = {
  star: Star,
  gift: Gift,
  'map-pin': MapPin,
  zap: Zap,
}

export default function RentDayOffers({ offers = [] }) {
  if (offers.length === 0) return null

  return (
    <div>
      <h3 className="text-lg font-semibold text-navy mb-3">Today&apos;s Offers</h3>
      <div className="space-y-3">
        {offers.map((offer, i) => {
          const Icon = iconMap[offer.icon] || Star
          return (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-coral-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-navy">{offer.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{offer.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
