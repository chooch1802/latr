import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Phone, Globe, Clock, Gift } from 'lucide-react'
import { getPartnerById } from '../lib/rewardsApi'

export default function PartnerDetailPage() {
  const { id } = useParams()
  const [partner, setPartner] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getPartnerById(id)
        setPartner(data)
      } catch {
        // Not found
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-500">Partner not found.</p>
        <Link to="/rewards/neighbourhood" className="text-coral-500 text-sm font-medium mt-2 inline-block">
          Back to Neighbourhood
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/rewards/neighbourhood" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">{partner.name}</h1>
      </div>

      {/* Hero */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
        {partner.image_url ? (
          <img src={partner.image_url} alt={partner.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl font-bold text-gray-300">{partner.name.charAt(0)}</span>
        )}
        {partner.is_featured && (
          <div className="absolute top-3 left-3 bg-coral-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Featured Partner
          </div>
        )}
      </div>

      {/* Info */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-lg font-bold text-navy">{partner.rating}</span>
          </div>
          <p className="text-xs text-gray-400">{partner.review_count} reviews</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-lg font-bold text-navy">{'$'.repeat(partner.price_level || 2)}</p>
          <p className="text-xs text-gray-400">Price level</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-xs font-semibold text-gray-600 capitalize">{partner.subcategory || partner.category}</p>
          <p className="text-xs text-gray-400">Category</p>
        </div>
      </div>

      {/* Bonus */}
      {partner.bonus_points > 0 && (
        <div className="bg-gradient-to-r from-coral-50 to-orange-50 border border-coral-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-coral-100 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 text-coral-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">+{partner.bonus_points} bonus points</p>
            <p className="text-xs text-gray-600">{partner.bonus_description || 'Earn bonus points when you visit'}</p>
          </div>
        </div>
      )}

      {/* Description */}
      {partner.description && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <h2 className="text-sm font-semibold text-navy mb-2">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{partner.description}</p>
        </div>
      )}

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
        {partner.address && (
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600">
              {partner.address}, {partner.suburb} {partner.state} {partner.postcode}
            </p>
          </div>
        )}
        {partner.phone && (
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <a href={`tel:${partner.phone}`} className="text-sm text-coral-500 hover:text-coral-600">
              {partner.phone}
            </a>
          </div>
        )}
        {partner.website && (
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-gray-400 shrink-0" />
            <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-sm text-coral-500 hover:text-coral-600 truncate">
              {partner.website}
            </a>
          </div>
        )}
      </div>

      {/* Tags */}
      {partner.tags && partner.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {partner.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full capitalize">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
