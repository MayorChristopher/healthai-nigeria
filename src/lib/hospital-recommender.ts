// Hospital data with specialties
const HOSPITALS = [
  { 
    name: "UNTH Enugu", 
    phone: "+234 42 252 3165", 
    address: "Ituku-Ozalla, Enugu", 
    coords: "6.4281,7.5243",
    specialties: ["emergency", "trauma", "cardiac", "general"]
  },
  { 
    name: "LUTH Lagos", 
    phone: "+234 1 263 2626", 
    address: "Idi-Araba, Mushin, Lagos", 
    coords: "6.5244,3.3792",
    specialties: ["emergency", "trauma", "cardiac", "pediatric", "general"]
  },
  { 
    name: "UCH Ibadan", 
    phone: "+234 2 241 3545", 
    address: "Queen Elizabeth Rd, Ibadan", 
    coords: "7.3775,3.9470",
    specialties: ["emergency", "trauma", "cardiac", "general"]
  },
  { 
    name: "ABUTH Zaria", 
    phone: "+234 69 550 477", 
    address: "Zaria-Kaduna Rd, Zaria", 
    coords: "11.0667,7.7000",
    specialties: ["emergency", "trauma", "general"]
  },
  { 
    name: "OAUTH Ile-Ife", 
    phone: "+234 36 230 210", 
    address: "Ile-Ife, Osun", 
    coords: "7.4905,4.5600",
    specialties: ["emergency", "general"]
  },
  { 
    name: "FMC Owerri", 
    phone: "+234 83 230 092", 
    address: "Owerri, Imo", 
    coords: "5.4840,7.0351",
    specialties: ["emergency", "general"]
  }
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

export function recommendHospitals(emergencyType: EmergencyType) {
  if (emergencyType === 'none') return []
  
  let filtered = HOSPITALS.filter(h => 
    h.specialties.includes(emergencyType) || h.specialties.includes('general')
  )
  
  return filtered.slice(0, 3).map(h => ({
    name: h.name,
    phone: h.phone,
    address: h.address,
    coords: h.coords,
    distance: "24/7 Emergency"
  }))
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
