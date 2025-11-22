import { calculateDistance } from './geolocation'

// Hospital data with specialties and coordinates - Major hospitals across Nigeria
const HOSPITALS = [
  // National Hospitals
  { name: "National Hospital Abuja", phone: "+234 9 461 2200", address: "Central Area, Abuja", coords: "9.0579,7.4951", lat: 9.0579, lon: 7.4951, state: "FCT", type: "national", specialties: ["emergency", "trauma", "cardiac", "general"] },
  
  // Teaching Hospitals
  { name: "LUTH Lagos", phone: "+234 1 263 2626", address: "Idi-Araba, Mushin, Lagos", coords: "6.5244,3.3792", lat: 6.5244, lon: 3.3792, state: "Lagos", type: "teaching", specialties: ["emergency", "trauma", "cardiac", "pediatric", "general"] },
  { name: "UCH Ibadan", phone: "+234 2 241 3545", address: "Queen Elizabeth Rd, Ibadan", coords: "7.3775,3.9470", lat: 7.3775, lon: 3.9470, state: "Oyo", type: "teaching", specialties: ["emergency", "trauma", "cardiac", "general"] },
  { name: "UNTH Enugu", phone: "+234 42 252 3165", address: "Ituku-Ozalla, Enugu", coords: "6.4281,7.5243", lat: 6.4281, lon: 7.5243, state: "Enugu", type: "teaching", specialties: ["emergency", "trauma", "cardiac", "general"] },
  { name: "AKTH Kano", phone: "+234 64 664 430", address: "Kano", coords: "12.0022,8.5920", lat: 12.0022, lon: 8.5920, state: "Kano", type: "teaching", specialties: ["emergency", "trauma", "general"] },
  { name: "UPTH Port Harcourt", phone: "+234 84 462 638", address: "Port Harcourt, Rivers", coords: "4.8156,7.0498", lat: 4.8156, lon: 7.0498, state: "Rivers", type: "teaching", specialties: ["emergency", "trauma", "general"] },
  { name: "ABUTH Zaria", phone: "+234 69 550 477", address: "Zaria-Kaduna Rd, Zaria", coords: "11.0667,7.7000", lat: 11.0667, lon: 7.7000, state: "Kaduna", type: "teaching", specialties: ["emergency", "trauma", "general"] },
  { name: "UCTH Calabar", phone: "+234 87 239 009", address: "Calabar, Cross River", coords: "4.9517,8.3417", lat: 4.9517, lon: 8.3417, state: "Cross River", type: "teaching", specialties: ["emergency", "general"] },
  { name: "JUTH Jos", phone: "+234 73 610 379", address: "Jos, Plateau", coords: "9.8965,8.8583", lat: 9.8965, lon: 8.8583, state: "Plateau", type: "teaching", specialties: ["emergency", "general"] },
  { name: "UITH Ilorin", phone: "+234 31 229 670", address: "Ilorin, Kwara", coords: "8.4799,4.5418", lat: 8.4799, lon: 4.5418, state: "Kwara", type: "teaching", specialties: ["emergency", "general"] },
  { name: "ABSUTH Aba", phone: "+234 82 220 456", address: "Aba, Abia", coords: "5.1066,7.3667", lat: 5.1066, lon: 7.3667, state: "Abia", type: "teaching", specialties: ["emergency", "general"] },
  { name: "Madonna University Teaching Hospital", phone: "+234 88 234 567", address: "Elele, Rivers", coords: "5.2833,6.8167", lat: 5.2833, lon: 6.8167, state: "Rivers", type: "teaching", specialties: ["emergency", "general"] },
  
  // Federal Medical Centers
  { name: "FMC Owerri", phone: "+234 83 230 092", address: "Owerri, Imo", coords: "5.4840,7.0351", lat: 5.4840, lon: 7.0351, state: "Imo", type: "federal", specialties: ["emergency", "general"] },
  { name: "FMC Umuahia", phone: "+234 88 220 134", address: "Umuahia, Abia", coords: "5.5250,7.4896", lat: 5.5250, lon: 7.4896, state: "Abia", type: "federal", specialties: ["emergency", "general"] },
  
  // Private/General Hospitals - Aba
  { name: "Trinity Hospital Aba", phone: "+234 82 225 789", address: "Faulks Road, Aba, Abia", coords: "5.1158,7.3496", lat: 5.1158, lon: 7.3496, state: "Abia", type: "general", specialties: ["emergency", "general"] }
]

type EmergencyType = 'cardiac' | 'trauma' | 'pediatric' | 'general' | 'none'

export function detectEmergencyType(symptoms: string): EmergencyType {
  const lower = symptoms.toLowerCase()
  
  if (
    lower.includes('chest pain') || 
    lower.includes('heart attack') ||
    lower.includes('chest pressure') ||
    lower.includes('heart pain')
  ) {
    return 'cardiac'
  }
  
  if (
    lower.includes('accident') ||
    lower.includes('bleeding') ||
    lower.includes('broken') ||
    lower.includes('fracture') ||
    lower.includes('injury')
  ) {
    return 'trauma'
  }
  
  if (
    (lower.includes('child') || lower.includes('baby') || lower.includes('pikin')) &&
    (lower.includes('fever') || lower.includes('convulsion') || lower.includes('breathing'))
  ) {
    return 'pediatric'
  }
  
  if (
    lower.includes('emergency') ||
    lower.includes('severe') ||
    lower.includes('unconscious') ||
    lower.includes('difficulty breathing') ||
    lower.includes('can\'t breathe')
  ) {
    return 'general'
  }
  
  return 'none'
}

export function recommendHospitals(
  emergencyType: EmergencyType,
  userLat?: number,
  userLon?: number,
  locationQuery?: string,
  filterType?: string,
  filterState?: string
) {
  let filtered = HOSPITALS
  
  // Filter by emergency type if it's not 'none'
  if (emergencyType !== 'none') {
    filtered = filtered.filter(h => 
      h.specialties.includes(emergencyType) || h.specialties.includes('general')
    )
  }
  
  // Filter by hospital type
  if (filterType && filterType !== 'all') {
    filtered = filtered.filter(h => h.type === filterType)
  }
  
  // Filter by state
  if (filterState && filterState !== 'all') {
    filtered = filtered.filter(h => h.state.toLowerCase() === filterState.toLowerCase())
  }
  
  // Filter by location query if provided
  if (locationQuery) {
    const query = locationQuery.toLowerCase()
    filtered = filtered.filter(h => 
      h.address.toLowerCase().includes(query) ||
      h.name.toLowerCase().includes(query) ||
      h.state.toLowerCase().includes(query)
    )
  }
  
  // Calculate distances if user location provided
  if (userLat && userLon) {
    filtered = filtered.map(h => ({
      ...h,
      distanceKm: calculateDistance(userLat, userLon, h.lat, h.lon)
    })).sort((a, b) => a.distanceKm - b.distanceKm)
  }
  
  const limit = locationQuery ? 5 : 3
  
  return filtered.slice(0, limit).map(h => ({
    name: h.name,
    phone: h.phone,
    address: h.address,
    coords: h.coords,
    type: h.type,
    state: h.state,
    distance: (h as any).distanceKm 
      ? `${Math.round((h as any).distanceKm)} km away` 
      : "24/7 Emergency"
  }))
}

export function getAllHospitals() {
  return HOSPITALS.map(h => ({
    name: h.name,
    phone: h.phone,
    address: h.address,
    coords: h.coords,
    type: h.type,
    state: h.state
  }))
}

export function getStates() {
  return [...new Set(HOSPITALS.map(h => h.state))].sort()
}

export function getHospitalTypes() {
  return ['all', 'national', 'teaching', 'federal', 'general']
}

export function shouldSuggestOnlineDoctor(symptoms: string): boolean {
  const lower = symptoms.toLowerCase()
  
  const onlineSymptoms = [
    'headache', 'fever', 'cough', 'cold', 'flu',
    'rash', 'itch', 'stomach', 'diarrhea', 'constipation',
    'tired', 'fatigue', 'stress', 'anxiety', 'insomnia'
  ]
  
  return onlineSymptoms.some(symptom => lower.includes(symptom))
}
