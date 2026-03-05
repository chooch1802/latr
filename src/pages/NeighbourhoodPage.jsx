import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Search } from 'lucide-react'
import { getNeighbourhoodPartners } from '../lib/rewardsApi'
import PartnerCard from '../components/neighbourhood/PartnerCard'
import CategoryFilter from '../components/neighbourhood/CategoryFilter'
import PartnerMap from '../components/neighbourhood/PartnerMap'

export default function NeighbourhoodPage() {
  const [partners, setPartners] = useState([])
  const [category, setCategory] = useState('')
  const [suburb, setSuburb] = useState('')
  const [search, setSearch] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getNeighbourhoodPartners({
          category: category || undefined,
          suburb: suburb || undefined,
        })
        setPartners(data)
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category, suburb])

  const suburbs = useMemo(() => {
    const set = new Set(partners.map((p) => p.suburb).filter(Boolean))
    return [...set].sort()
  }, [partners])

  const filtered = useMemo(() => {
    if (!search) return partners
    const q = search.toLowerCase()
    return partners.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.suburb?.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    )
  }, [partners, search])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Link to="/rewards" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-navy">Neighbourhood</h1>
        <button
          onClick={() => setShowMap(!showMap)}
          className="ml-auto flex items-center gap-1.5 h-8 px-3 rounded-full bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <MapPin className="w-3.5 h-3.5" />
          {showMap ? 'Grid' : 'Map'}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search partners..."
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
        />
      </div>

      {/* Filters */}
      <div className="mb-4">
        <CategoryFilter
          value={category}
          onChange={setCategory}
          suburbs={suburbs}
          suburbValue={suburb}
          onSuburbChange={setSuburb}
        />
      </div>

      {/* Map view */}
      {showMap && (
        <div className="mb-4">
          <PartnerMap partners={filtered} />
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No partners found. Try a different category or suburb.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-3">{filtered.length} partners</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filtered.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
