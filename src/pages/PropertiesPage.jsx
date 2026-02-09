import { useState, useEffect } from 'react'
import { Home, AlertCircle, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'
import PropertyCard from '../components/properties/PropertyCard'
import PropertyFilter from '../components/properties/PropertyFilter'

export default function PropertiesPage() {
  const toast = useToast()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    bedrooms: '',
    maxPrice: '',
  })

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      toast.error('Failed to load properties. Please try again.')
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // Client-side filtering
  const filtered = properties.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const match = `${p.address} ${p.city} ${p.state} ${p.postcode}`.toLowerCase()
      if (!match.includes(q)) return false
    }
    if (filters.city && p.city !== filters.city) return false
    if (filters.bedrooms) {
      const beds = parseInt(filters.bedrooms)
      if (beds === 3) {
        if (p.bedrooms < 3) return false
      } else if (p.bedrooms !== beds) return false
    }
    if (filters.maxPrice && Number(p.rent_amount) > Number(filters.maxPrice)) return false
    return true
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-1">Browse Properties</h1>
        <p className="text-gray-500">Find your next home and apply instantly.</p>
      </div>

      <PropertyFilter filters={filters} onChange={setFilters} />

      {error ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-navy mb-1">Failed to load properties</h2>
          <p className="text-gray-500 text-sm mb-4">Something went wrong. Please try again.</p>
          <button
            onClick={() => { setError(false); setLoading(true); fetchProperties() }}
            className="h-10 px-5 bg-coral-500 text-white font-medium rounded-xl text-sm hover:bg-coral-600 transition-colors cursor-pointer inline-flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-navy mb-1">No properties found</h2>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  )
}
