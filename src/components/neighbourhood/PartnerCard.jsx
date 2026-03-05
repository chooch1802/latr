import { Link } from 'react-router-dom'
import { Star, MapPin } from 'lucide-react'
import PartnerBonusBadge from './PartnerBonusBadge'

export default function PartnerCard({ partner }) {
  return (
    <Link
      to={`/rewards/neighbourhood/${partner.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm hover:border-gray-300 transition-all"
    >
      {/* Image / placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {partner.image_url ? (
          <img src={partner.image_url} alt={partner.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl font-bold text-gray-300">{partner.name.charAt(0)}</span>
        )}
        {partner.bonus_points > 0 && (
          <div className="absolute top-2 right-2">
            <PartnerBonusBadge points={partner.bonus_points} />
          </div>
        )}
        {partner.is_featured && (
          <div className="absolute top-2 left-2 bg-coral-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Featured
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-navy group-hover:text-coral-500 transition-colors truncate">
          {partner.name}
        </h3>
        <p className="text-xs text-gray-500 capitalize">{partner.subcategory || partner.category}</p>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-gray-600">{partner.rating}</span>
          </div>
          {partner.suburb && (
            <div className="flex items-center gap-0.5 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              {partner.suburb}
            </div>
          )}
          <span className="text-xs text-gray-300 ml-auto">
            {'$'.repeat(partner.price_level || 2)}
          </span>
        </div>
      </div>
    </Link>
  )
}
