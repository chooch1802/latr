import { Link } from 'react-router-dom'
import { Bed, Bath, Home, MapPin } from 'lucide-react'

export default function PropertyCard({ property }) {
  const imageUrl = property.images?.[0]
    ? `${property.images[0]}?w=600&h=400&fit=crop`
    : null

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:shadow-medium hover:border-gray-300"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
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
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-xl font-bold text-navy">
            ${Number(property.rent_amount).toLocaleString('en-AU')}
          </span>
          <span className="text-sm text-gray-500">/{property.rent_period}</span>
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

        {/* CTA */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <span className="text-sm font-semibold text-coral-500 group-hover:text-coral-600 transition-colors">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  )
}
