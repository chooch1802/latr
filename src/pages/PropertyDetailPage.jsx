import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bed, Bath, Home, MapPin, Calendar, DollarSign, Heart, Share2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    async function fetch() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()
        if (error) throw error
        setProperty(data)
      } catch {
        navigate('/properties', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="aspect-[16/9] bg-gray-200 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (!property) return null

  const images = property.images || []
  const imageUrl = images[selectedImage]
    ? `${images[selectedImage]}?w=1200&h=600&fit=crop`
    : null

  const availableDate = property.available_date
    ? new Date(property.available_date).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : 'Contact agent'

  return (
    <div>
      {/* Navy gradient header with image */}
      <div className="bg-gradient-to-b from-navy to-navy/90 rounded-2xl overflow-hidden mb-6">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer">
              <Heart className="w-4 h-4" />
            </button>
            <button type="button" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image with LATR badge */}
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.address}
              className="w-full aspect-[16/9] object-cover"
            />
          ) : (
            <div className="w-full aspect-[16/9] flex items-center justify-center text-white/30">
              <Home className="w-16 h-16" />
            </div>
          )}
          {/* LATR badge */}
          <div className="absolute top-3 right-3 bg-coral-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            LATR
          </div>
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 py-3">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImage(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === selectedImage ? 'w-6 bg-white' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price & Address */}
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-navy">
                ${Number(property.rent_amount).toLocaleString('en-AU')}
              </span>
              <span className="text-gray-500">/{property.rent_period}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <p className="text-lg text-gray-700">
                {property.address}, {property.city} {property.state} {property.postcode}
              </p>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <Bed className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-navy">
                {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} Bed`}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <Bath className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-navy">{property.bathrooms} Bath</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <Home className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-navy capitalize">{property.property_type}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-sm font-semibold text-navy">Available</p>
            </div>
          </div>

          {/* Feature tags */}
          {property.features?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-coral-50 text-coral-500 text-sm font-medium rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-navy mb-3">About this property</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {property.bedrooms === 0 ? 'A modern studio' : `A spacious ${property.bedrooms}-bedroom ${property.property_type}`} located
              in the heart of {property.city}. This property features {property.bathrooms} bathroom{property.bathrooms > 1 ? 's' : ''}
              {' '}and is available from {availableDate}. Perfect for professionals or small families looking for
              comfortable living in a prime location.
            </p>
          </div>

          {/* Listing source */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-navy mb-3">Listing Details</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-coral-100 text-coral-500 flex items-center justify-center text-sm font-bold">
                L
              </div>
              <div>
                <p className="font-medium text-navy">Listed on LATR</p>
                <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
              </div>
            </div>
            {property.listing_url && (
              <a
                href={property.listing_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm text-coral-500 hover:text-coral-600 font-medium transition-colors"
              >
                View original listing
              </a>
            )}
          </div>
        </div>

        {/* Sidebar CTA */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <div className="flex items-baseline gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-coral-500" />
              <span className="text-2xl font-bold text-navy">
                ${Number(property.rent_amount).toLocaleString('en-AU')}
              </span>
              <span className="text-gray-500 text-sm">/{property.rent_period}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Available {availableDate}
            </p>

            <Link
              to={`/apply/new/${property.id}`}
              className="block w-full h-12 bg-coral-500 text-white font-semibold rounded-xl text-center leading-[3rem] transition-colors hover:bg-coral-600"
            >
              Apply for this Property
            </Link>

            <p className="text-xs text-gray-400 text-center mt-3">
              Your profile info will be pre-filled
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
