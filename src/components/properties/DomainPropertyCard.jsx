import { Bed, Bath, Home, MapPin, ExternalLink, Bookmark } from 'lucide-react'

export default function DomainPropertyCard({ property, onSave, saving = false }) {
  const imageUrl = property.images?.[0] || null

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:shadow-medium hover:border-gray-300">
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.address}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Home className="w-12 h-12" />
          </div>
        )}
        {/* Domain badge */}
        <span className="absolute top-3 left-3 bg-navy/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          Domain.com.au
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-xl font-bold text-navy">
            ${Number(property.rent_amount).toLocaleString('en-AU')}
          </span>
          <span className="text-sm text-gray-500">/week</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-700">
            {property.address}, {property.city} {property.state} {property.postcode}
          </p>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            {property.bathrooms} bath
          </span>
          <span className="flex items-center gap-1">
            <Home className="w-4 h-4" />
            {property.property_type}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSave?.(property)}
            disabled={saving}
            className="flex-1 h-9 bg-coral-500 text-white text-sm font-semibold rounded-xl hover:bg-coral-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save to LATR'}
          </button>
          {property.listing_url && (
            <a
              href={property.listing_url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-coral-500 hover:border-coral-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
