import { useState, useEffect, useRef, useCallback } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { X } from 'lucide-react'

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY

let optionsSet = false
let loaderPromise = null

function getGoogleMaps() {
  if (!API_KEY) return Promise.resolve(null)
  if (!loaderPromise) {
    if (!optionsSet) {
      setOptions({ key: API_KEY })
      optionsSet = true
    }
    loaderPromise = importLibrary('places')
  }
  return loaderPromise
}

function parseAddressComponents(components) {
  const get = (type) =>
    components.find((c) => c.types.includes(type))

  const streetNumber = get('street_number')?.long_name || ''
  const route = get('route')?.long_name || ''
  const addressLine1 = [streetNumber, route].filter(Boolean).join(' ')
  const city =
    get('locality')?.long_name ||
    get('sublocality')?.long_name ||
    get('sublocality_level_1')?.long_name ||
    ''
  const state = get('administrative_area_level_1')?.short_name || ''
  const postcode = get('postal_code')?.long_name || ''

  return { addressLine1, city, state, postcode }
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Start typing an address...',
  error,
  id,
  className = '',
}) {
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const autocompleteService = useRef(null)
  const placesService = useRef(null)
  const dummyDiv = useRef(null)
  const debounceTimer = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    getGoogleMaps().then((places) => {
      if (!places) return
      autocompleteService.current = new places.AutocompleteService()
      if (!dummyDiv.current) {
        dummyDiv.current = document.createElement('div')
      }
      placesService.current = new places.PlacesService(dummyDiv.current)
    })
  }, [])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = useCallback((input) => {
    if (!autocompleteService.current || !input || input.length < 3) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    setLoading(true)
    autocompleteService.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'au' },
        types: ['address'],
      },
      (predictions, status) => {
        setLoading(false)
        if (status === 'OK' && predictions) {
          setSuggestions(predictions)
          setShowDropdown(true)
        } else {
          setSuggestions([])
          setShowDropdown(false)
        }
      }
    )
  }, [])

  function handleInputChange(e) {
    const val = e.target.value
    onChange(val)

    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(val)
    }, 300)
  }

  function handleSelect(prediction) {
    if (!placesService.current) return

    placesService.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['address_components', 'formatted_address'],
      },
      (place, status) => {
        if (status === 'OK' && place) {
          const parsed = parseAddressComponents(place.address_components)
          onChange(parsed.addressLine1 || prediction.description)
          onSelect?.({
            ...parsed,
            formattedAddress: place.formatted_address,
          })
        }
        setShowDropdown(false)
        setSuggestions([])
      }
    )
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  const baseInputClass =
    'w-full h-12 px-4 rounded-xl border-2 text-gray-900 placeholder-gray-400 transition-colors focus:border-coral-500 focus:outline-none'

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={className || `${baseInputClass} ${error ? 'border-red-400' : 'border-gray-200'}`}
      />

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Suggestions
            </span>
            <button
              type="button"
              onClick={() => setShowDropdown(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {suggestions.map((prediction) => (
              <li key={prediction.place_id}>
                <button
                  type="button"
                  onClick={() => handleSelect(prediction)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-coral-50 hover:text-coral-600 transition-colors cursor-pointer"
                >
                  {prediction.description}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-coral-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
