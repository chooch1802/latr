import { supabase } from './supabase'

/**
 * Search Domain.com.au listings via the domain-search edge function.
 * Returns { properties, error }.
 */
export async function searchDomain({ suburb, state, minBeds, maxPrice, propertyTypes }) {
  const { data, error } = await supabase.functions.invoke('domain-search', {
    body: { suburb, state, minBeds, maxPrice, propertyTypes },
  })

  if (error) {
    // Edge function returned non-2xx — check for DOMAIN_NOT_CONFIGURED
    const body = typeof error === 'object' && error.context
      ? await error.context.json?.().catch(() => null)
      : null
    if (body?.error === 'DOMAIN_NOT_CONFIGURED') {
      return { properties: [], notConfigured: true }
    }
    return { properties: [], error: error.message || 'Search failed' }
  }

  if (data?.error === 'DOMAIN_NOT_CONFIGURED') {
    return { properties: [], notConfigured: true }
  }

  return { properties: data?.properties || [] }
}

/**
 * Save a Domain listing to the local properties table.
 * Upserts on domain_listing_id so re-saving is idempotent.
 */
export async function saveDomainListing(property) {
  const { data, error } = await supabase
    .from('properties')
    .upsert(
      {
        domain_listing_id: property.domain_listing_id,
        address: property.address,
        city: property.city,
        state: property.state,
        postcode: property.postcode,
        rent_amount: property.rent_amount,
        rent_period: property.rent_period,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        parking: property.parking,
        property_type: property.property_type,
        available_date: property.available_date,
        listing_url: property.listing_url,
        images: property.images,
        features: property.features,
        description: property.description,
        source: 'domain',
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: 'domain_listing_id' }
    )
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }
  return { data }
}
