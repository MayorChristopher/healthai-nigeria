// Google Maps Places API Integration
// Get real-time hospital information

export type PlaceDetails = {
  name: string
  address: string
  phone: string
  rating?: number
  openNow?: boolean
  website?: string
  photos?: string[]
}

// Get nearby hospitals using Google Places API
export async function getNearbyHospitals(
  latitude: number,
  longitude: number,
  radius: number = 5000 // 5km default
): Promise<PlaceDetails[]> {
  
  // Note: This requires Google Maps API key
  // Add to .env.local: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    console.warn('Google Maps API key not set')
    return []
  }

  try {
    // Google Places Nearby Search
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=hospital&key=${apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status !== 'OK') {
      console.error('Google Places API error:', data.status)
      return []
    }

    // Transform results
    return data.results.slice(0, 5).map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      phone: place.formatted_phone_number || 'Call for info',
      rating: place.rating,
      openNow: place.opening_hours?.open_now,
      website: place.website,
      photos: place.photos?.map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
      )
    }))
    
  } catch (error) {
    console.error('Failed to fetch nearby hospitals:', error)
    return []
  }
}

// Get hospital details by place ID
export async function getHospitalDetails(placeId: string): Promise<PlaceDetails | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  if (!apiKey) return null

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,rating,opening_hours,website,photos&key=${apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status !== 'OK') return null

    const place = data.result
    
    return {
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number || 'Not available',
      rating: place.rating,
      openNow: place.opening_hours?.open_now,
      website: place.website,
      photos: place.photos?.map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`
      )
    }
    
  } catch (error) {
    console.error('Failed to fetch hospital details:', error)
    return null
  }
}

// Get user's current location
export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  })
}

// Calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // Distance in km
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m away`
  }
  return `${km.toFixed(1)}km away`
}
