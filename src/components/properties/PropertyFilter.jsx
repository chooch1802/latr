import { Search, SlidersHorizontal } from 'lucide-react'

const CITIES = ['All Cities', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
const BEDROOMS = ['Any', 'Studio', '1', '2', '3+']

export default function PropertyFilter({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by address or suburb..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-base text-gray-900 placeholder-gray-400 focus:border-coral-500 focus:outline-none"
          />
        </div>

        {/* City */}
        <select
          value={filters.city}
          onChange={(e) => update('city', e.target.value)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-base text-gray-700 bg-white focus:border-coral-500 focus:outline-none"
        >
          {CITIES.map((c) => (
            <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>
          ))}
        </select>

        {/* Bedrooms */}
        <select
          value={filters.bedrooms}
          onChange={(e) => update('bedrooms', e.target.value)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-base text-gray-700 bg-white focus:border-coral-500 focus:outline-none"
        >
          {BEDROOMS.map((b) => (
            <option key={b} value={b === 'Any' ? '' : b === 'Studio' ? '0' : b === '3+' ? '3' : b}>
              {b === 'Any' ? 'Any Beds' : b === 'Studio' ? 'Studio' : `${b} Bed${b === '1' ? '' : 's'}`}
            </option>
          ))}
        </select>

        {/* Price range */}
        <select
          value={filters.maxPrice}
          onChange={(e) => update('maxPrice', e.target.value)}
          className="h-10 px-3 rounded-xl border border-gray-200 text-base text-gray-700 bg-white focus:border-coral-500 focus:outline-none"
        >
          <option value="">Any Price</option>
          <option value="400">Up to $400/wk</option>
          <option value="600">Up to $600/wk</option>
          <option value="800">Up to $800/wk</option>
          <option value="1000">Up to $1,000/wk</option>
          <option value="1500">Up to $1,500/wk</option>
        </select>
      </div>
    </div>
  )
}
