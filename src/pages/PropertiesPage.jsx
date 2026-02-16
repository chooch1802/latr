import { useState, useEffect, useRef } from 'react'
import { Home, AlertCircle, RefreshCw, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'
import { searchDomain, saveDomainListing } from '../lib/domainApi'
import PropertyCard from '../components/properties/PropertyCard'
import DomainPropertyCard from '../components/properties/DomainPropertyCard'
import PropertyFilter from '../components/properties/PropertyFilter'

export default function PropertiesPage() {
  const toast = useToast()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    propertyType: '',
    bedrooms: '',
    maxPrice: '',
  })

  // Domain search state
  const [mode, setMode] = useState('local')
  const [domainAvailable, setDomainAvailable] = useState(false)
  const [domainFilters, setDomainFilters] = useState({ suburb: '', state: 'NSW', minBeds: '', maxPrice: '' })
  const [domainResults, setDomainResults] = useState([])
  const [domainSearching, setDomainSearching] = useState(false)
  const [domainSearched, setDomainSearched] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const checkedDomain = useRef(false)

  useEffect(() => {
    fetchProperties()
    checkDomainAvailability()
  }, [])

  async function fetchProperties() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch {
      toast.error('Failed to load properties. Please try again.')
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  async function checkDomainAvailability() {
    if (checkedDomain.current) return
    checkedDomain.current = true
    // Probe the edge function with a minimal request to see if credentials are configured
    const result = await searchDomain({ suburb: '_probe', state: 'NSW' })
    if (!result.notConfigured) {
      setDomainAvailable(true)
    }
  }

  async function handleDomainSearch() {
    setDomainSearching(true)
    setDomainSearched(true)
    const result = await searchDomain({
      suburb: domainFilters.suburb,
      state: domainFilters.state,
      minBeds: domainFilters.minBeds ? Number(domainFilters.minBeds) : undefined,
      maxPrice: domainFilters.maxPrice ? Number(domainFilters.maxPrice) : undefined,
    })
    if (result.error) {
      toast.error(result.error)
    }
    setDomainResults(result.properties)
    setDomainSearching(false)
  }

  async function handleSaveListing(property) {
    setSavingId(property.domain_listing_id)
    const { data, error } = await saveDomainListing(property)
    if (error) {
      toast.error(`Failed to save: ${error}`)
    } else {
      toast.success('Property saved to LATR!')
      // Add to local list if not already present
      setProperties((prev) => {
        if (prev.some((p) => p.domain_listing_id === property.domain_listing_id)) return prev
        return [data, ...prev]
      })
    }
    setSavingId(null)
  }

  // Client-side filtering for local properties
  const filtered = properties.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const match = `${p.address} ${p.city} ${p.state} ${p.postcode}`.toLowerCase()
      if (!match.includes(q)) return false
    }
    if (filters.city && p.city !== filters.city) return false
    if (filters.propertyType) {
      const types = filters.propertyType === 'Unit/Apartment' ? ['unit', 'apartment'] : [filters.propertyType.toLowerCase()]
      if (!types.includes(p.property_type?.toLowerCase())) return false
    }
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

      <PropertyFilter
        filters={filters}
        onChange={setFilters}
        mode={mode}
        onModeChange={setMode}
        domainAvailable={domainAvailable}
        domainFilters={domainFilters}
        onDomainFiltersChange={setDomainFilters}
        onDomainSearch={handleDomainSearch}
        domainSearching={domainSearching}
      />

      {mode === 'local' ? (
        /* Local / Saved properties view */
        error ? (
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
        )
      ) : (
        /* Domain search results view */
        domainSearching ? (
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
        ) : domainResults.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {domainResults.map((property) => (
              <DomainPropertyCard
                key={property.domain_listing_id}
                property={property}
                onSave={handleSaveListing}
                saving={savingId === property.domain_listing_id}
              />
            ))}
          </div>
        ) : domainSearched ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-navy mb-1">No listings found</h2>
            <p className="text-gray-500 text-sm">Try a different suburb or adjust your filters.</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-navy mb-1">Search Domain.com.au</h2>
            <p className="text-gray-500 text-sm">Enter a suburb and state above to find rental listings.</p>
          </div>
        )
      )}
    </div>
  )
}
