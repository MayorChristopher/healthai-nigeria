// Follow-up question handler for location and other contextual questions

export type FollowUpType = 'location' | 'severity' | 'duration' | 'none'

export interface FollowUpQuestion {
  type: FollowUpType
  question: string
  questionPidgin: string
  context: string
  requiresLocation?: boolean
}

export function detectFollowUpNeeds(aiResponse: string, userMessage: string): FollowUpQuestion | null {
  const response = aiResponse.toLowerCase()
  const message = userMessage.toLowerCase()
  
  // Check if user is asking for hospitals in a location
  const hospitalLocationRequest = 
    message.includes('hospital') && 
    (message.includes(' in ') || message.includes('near') || message.includes('around') || message.includes('location'))
  
  // Check if AI mentioned hospitals but no location was provided, or if user asked for hospital locations
  if (response.includes('hospital') || response.includes('nearest') || response.includes('emergency') || hospitalLocationRequest) {
    return {
      type: 'location',
      question: "To find the nearest hospital, please share your location or tell me your area (e.g., 'Ikeja Lagos', 'Garki Abuja', 'Victoria Island')",
      questionPidgin: "Make I find hospital wey near you, tell me your area (like 'Ikeja Lagos', 'Garki Abuja', 'Victoria Island')",
      context: 'hospital_recommendation',
      requiresLocation: true
    }
  }
  
  // Check for severity follow-up
  if (response.includes('pain') && !message.includes('severe') && !message.includes('mild')) {
    return {
      type: 'severity',
      question: "How would you rate your pain from 1-10? (1 = mild, 10 = severe)",
      questionPidgin: "How you go rate your pain from 1-10? (1 = small small, 10 = serious)",
      context: 'pain_assessment'
    }
  }
  
  // Check for duration follow-up
  if ((response.includes('fever') || response.includes('symptoms')) && 
      !message.includes('day') && !message.includes('week') && !message.includes('hour')) {
    return {
      type: 'duration',
      question: "How long have you had these symptoms? (hours, days, weeks)",
      questionPidgin: "How long these symptoms don start? (hours, days, weeks)",
      context: 'symptom_duration'
    }
  }
  
  return null
}

export function processLocationResponse(locationText: string): { lat?: number, lon?: number, city?: string, address?: string } {
  const text = locationText.toLowerCase()
  
  // Nigerian cities and landmarks with coordinates
  const locations = {
    // Major cities
    'lagos': { lat: 6.5244, lon: 3.3792, city: 'Lagos', address: 'Lagos, Nigeria' },
    'abuja': { lat: 9.0579, lon: 7.4951, city: 'Abuja', address: 'Abuja, Nigeria' },
    'kano': { lat: 12.0022, lon: 8.5920, city: 'Kano', address: 'Kano, Nigeria' },
    'ibadan': { lat: 7.3775, lon: 3.9470, city: 'Ibadan', address: 'Ibadan, Oyo State' },
    'port harcourt': { lat: 4.8156, lon: 7.0498, city: 'Port Harcourt', address: 'Port Harcourt, Rivers State' },
    'benin': { lat: 6.3350, lon: 5.6037, city: 'Benin City', address: 'Benin City, Edo State' },
    'kaduna': { lat: 10.5105, lon: 7.4165, city: 'Kaduna', address: 'Kaduna, Nigeria' },
    'jos': { lat: 9.8965, lon: 8.8583, city: 'Jos', address: 'Jos, Plateau State' },
    'ilorin': { lat: 8.4799, lon: 4.5418, city: 'Ilorin', address: 'Ilorin, Kwara State' },
    'enugu': { lat: 6.4281, lon: 7.5243, city: 'Enugu', address: 'Enugu, Nigeria' },
    'owerri': { lat: 5.4840, lon: 7.0351, city: 'Owerri', address: 'Owerri, Imo State' },
    'calabar': { lat: 4.9517, lon: 8.3417, city: 'Calabar', address: 'Calabar, Cross River State' },
    'umuahia': { lat: 5.5250, lon: 7.4896, city: 'Umuahia', address: 'Umuahia, Abia State' },
    'aba': { lat: 5.1066, lon: 7.3667, city: 'Aba', address: 'Aba, Abia State' },
    
    // Lagos areas
    'ikeja': { lat: 6.6018, lon: 3.3515, city: 'Lagos', address: 'Ikeja, Lagos' },
    'victoria island': { lat: 6.4281, lon: 3.4219, city: 'Lagos', address: 'Victoria Island, Lagos' },
    'lekki': { lat: 6.4698, lon: 3.5852, city: 'Lagos', address: 'Lekki, Lagos' },
    'surulere': { lat: 6.5056, lon: 3.3619, city: 'Lagos', address: 'Surulere, Lagos' },
    'yaba': { lat: 6.5158, lon: 3.3696, city: 'Lagos', address: 'Yaba, Lagos' },
    
    // Abuja areas
    'garki': { lat: 9.0579, lon: 7.4951, city: 'Abuja', address: 'Garki, Abuja' },
    'wuse': { lat: 9.0579, lon: 7.4951, city: 'Abuja', address: 'Wuse, Abuja' },
    'maitama': { lat: 9.0579, lon: 7.4951, city: 'Abuja', address: 'Maitama, Abuja' }
  }
  
  // Check for location matches
  for (const [locationName, coords] of Object.entries(locations)) {
    if (text.includes(locationName)) {
      return coords
    }
  }
  
  // Try to extract coordinates if provided directly
  const coordMatch = text.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/)
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1])
    const lon = parseFloat(coordMatch[2])
    return {
      lat,
      lon,
      address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`
    }
  }
  
  // If no match, return the text as address for manual processing
  if (text.trim()) {
    return { address: locationText.trim() }
  }
  
  return {}
}