import { Search } from 'lucide-react'

const CITIES = ['All Cities', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
const PROPERTY_TYPES = ['All Types', 'House', 'Unit/Apartment', 'Townhouse', 'Warehouse', 'Office']
const BEDROOMS = ['Any', 'Studio', '1', '2', '3+']

const STATES = [
  { value: 'NSW', label: 'NSW' },
  { value: 'VIC', label: 'VIC' },
  { value: 'QLD', label: 'QLD' },
  { value: 'WA', label: 'WA' },
  { value: 'SA', label: 'SA' },
  { value: 'TAS', label: 'TAS' },
  { value: 'ACT', label: 'ACT' },
  { value: 'NT', label: 'NT' },
]

export default function PropertyFilter({
  filters,
  onChange,
  mode = 'local',
  onModeChange,
  domainAvailable = false,
  domainFilters,
  onDomainFiltersChange,
  onDomainSearch,
  domainSearching = false,
}) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  function updateDomain(key, value) {
    onDomainFiltersChange?.({ ...domainFilters, [key]: value })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
      {/* Mode tabs */}
      {domainAvailable && (
        <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => onModeChange?.('local')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'local'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Saved
          </button>
          <button
            type="button"
            onClick={() => onModeChange?.('domain')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              mode === 'domain'
                ? 'bg-white text-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Search Domain
          </button>
        </div>
      )}

      {mode === 'local' ? (
        /* Local filter controls — unchanged */
        <div className="flex flex-col sm:flex-row gap-3">
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

          <select
            value={filters.city}
            onChange={(e) => update('city', e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 text-base text-gray-700 bg-white focus:border-coral-500 focus:outline-none"
          >
            {CITIES.map((c) => (
              <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>
            ))}
          </select>

          <select
            value={filters.propertyType}
            onChange={(e) => update('propertyType', e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 text-base text-gray-700 bg-white focus:border-coral-500 focus:outline-none"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t === 'All Types' ? '' : t}>{t}</option>
            ))}
          </select>

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
      ) : (
        /* Domain search controls */
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onDomainSearch?.()
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter suburb (e.g. Bondi, Carlton)..."
              value={domainFilters?.suburb || ''}
              onChange={(e) => updateDomain('suburb', e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-base text-gray-900 placeholder-gray-400 focus:border-coral-500 focus:outline-none"
            />
          </div>

          <select
            value={domainFilters?.state || 'NSW'}
            onChange={(e) => updateDomain('state', e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 text-base text-gray-700 bg-white focus:border-coral-500 focus:outline-none"
          >
            {STATES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <select
            value={domainFilters?.minBeds || ''}
            onChange={(e) => updateDomain('minBeds', e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 text-base text-gray-700 bg-white focus:border-coral-500 focus:outline-none"
          >
            {BEDROOMS.map((b) => (
              <option key={b} value={b === 'Any' ? '' : b === 'Studio' ? '0' : b === '3+' ? '3' : b}>
                {b === 'Any' ? 'Any Beds' : b === 'Studio' ? 'Studio' : `${b}+ Bed${b === '1' ? '' : 's'}`}
              </option>
            ))}
          </select>

          <select
            value={domainFilters?.maxPrice || ''}
            onChange={(e) => updateDomain('maxPrice', e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 text-base text-gray-700 bg-white focus:border-coral-500 focus:outline-none"
          >
            <option value="">Any Price</option>
            <option value="400">Up to $400/wk</option>
            <option value="600">Up to $600/wk</option>
            <option value="800">Up to $800/wk</option>
            <option value="1000">Up to $1,000/wk</option>
            <option value="1500">Up to $1,500/wk</option>
          </select>

          <button
            type="submit"
            disabled={!domainFilters?.suburb || domainSearching}
            className="h-10 px-5 bg-coral-500 text-white font-medium rounded-xl text-sm hover:bg-coral-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {domainSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      )}
    </div>
  )
}
