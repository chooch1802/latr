import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export default function PartnerMap({ partners = [], selectedId, onSelect }) {
  const mapRef = useRef(null)
  const [mapInstance, setMapInstance] = useState(null)
  const markersRef = useRef([])

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey || !mapRef.current) return

    const loader = new Loader({ apiKey, version: 'weekly' })

    loader.importLibrary('maps').then(({ Map }) => {
      const map = new Map(mapRef.current, {
        center: { lat: -33.8688, lng: 151.2093 }, // Sydney CBD
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
        mapId: 'latr-neighbourhood',
      })
      setMapInstance(map)
    })
  }, [])

  useEffect(() => {
    if (!mapInstance) return

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    const validPartners = partners.filter((p) => p.latitude && p.longitude)
    if (validPartners.length === 0) return

    // Note: using legacy markers for broad compatibility
    validPartners.forEach((partner) => {
      const marker = new google.maps.Marker({
        position: { lat: Number(partner.latitude), lng: Number(partner.longitude) },
        map: mapInstance,
        title: partner.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: selectedId === partner.id ? 10 : 7,
          fillColor: selectedId === partner.id ? '#FF5A3D' : '#6B7280',
          fillOpacity: 0.9,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      })

      marker.addListener('click', () => {
        onSelect?.(partner.id)
      })

      markersRef.current.push(marker)
    })

    // Fit bounds
    if (validPartners.length > 1) {
      const bounds = new google.maps.LatLngBounds()
      validPartners.forEach((p) => bounds.extend({ lat: Number(p.latitude), lng: Number(p.longitude) }))
      mapInstance.fitBounds(bounds, 50)
    }
  }, [mapInstance, partners, selectedId, onSelect])

  return (
    <div
      ref={mapRef}
      className="w-full h-64 rounded-xl bg-gray-100 overflow-hidden"
      aria-label="Partner locations map"
    />
  )
}
