// Offline emergency functionality for rural areas with poor connectivity

export interface OfflineEmergencyData {
  emergencyContacts: string[]
  basicFirstAid: string[]
  hospitalList: string[]
  emergencyPhrases: { english: string; pidgin: string }[]
}

// Critical emergency information that works offline
export const OFFLINE_EMERGENCY_DATA: OfflineEmergencyData = {
  emergencyContacts: [
    "Nigeria Emergency: 112",
    "Police: 199", 
    "Fire Service: 199",
    "NEMA: +234 800 CALL NEMA"
  ],
  
  basicFirstAid: [
    "Severe bleeding: Apply direct pressure with clean cloth",
    "Unconscious person: Check breathing, place in recovery position", 
    "Choking: 5 back blows, 5 chest thrusts",
    "Burns: Cool with clean water for 10+ minutes",
    "Chest pain: Keep person calm, call 112 immediately",
    "Difficulty breathing: Sit person upright, loosen tight clothing"
  ],
  
  hospitalList: [
    "National Hospital Abuja: +234 9 461 2200",
    "LUTH Lagos: +234 1 263 2626", 
    "UCH Ibadan: +234 2 241 3545",
    "UNTH Enugu: +234 42 252 3165",
    "AKTH Kano: +234 64 664 430",
    "FMC Umuahia: +234 88 220 134"
  ],
  
  emergencyPhrases: [
    { english: "This is a medical emergency", pidgin: "This na emergency for hospital" },
    { english: "Need ambulance immediately", pidgin: "We need ambulance sharp sharp" },
    { english: "Person is unconscious", pidgin: "Person don faint, e no dey wake up" },
    { english: "Severe bleeding", pidgin: "Blood dey comot plenty" },
    { english: "Can't breathe properly", pidgin: "E no fit breathe well" }
  ]
}

// Store emergency data in localStorage for offline access
export function cacheEmergencyData(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('healthai-emergency-data', JSON.stringify(OFFLINE_EMERGENCY_DATA))
    localStorage.setItem('healthai-emergency-cached', new Date().toISOString())
  }
}

// Retrieve cached emergency data when offline
export function getOfflineEmergencyData(): OfflineEmergencyData | null {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('healthai-emergency-data')
    return cached ? JSON.parse(cached) : null
  }
  return null
}

// Check if user is online
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true
}

// Generate offline emergency response
export function generateOfflineEmergencyResponse(symptoms: string, language: 'english' | 'pidgin' = 'english'): string {
  const data = getOfflineEmergencyData() || OFFLINE_EMERGENCY_DATA
  
  const isEmergency = symptoms.toLowerCase().includes('chest pain') || 
                     symptoms.toLowerCase().includes('bleeding') ||
                     symptoms.toLowerCase().includes('unconscious') ||
                     symptoms.toLowerCase().includes('breathe')
  
  if (language === 'pidgin') {
    return isEmergency 
      ? `🚨 EMERGENCY: This thing serious o! Call 112 now now. If no network, find person wey get phone or go nearest hospital sharp sharp.

Basic help:
- If person dey bleed: Press the place with clean cloth
- If person faint: Put am for side, check if e dey breathe
- If chest pain: Make the person sit down, call 112

Hospitals near you:
${data.hospitalList.slice(0, 3).join('\n')}

⚠️ This na emergency advice. Find doctor quick quick!`
      
      : `I no get internet connection now, but I fit help small small. 

For emergency, call 112. If symptoms serious, no wait - go hospital.

Basic hospitals:
${data.hospitalList.slice(0, 3).join('\n')}

⚠️ See doctor for proper check. This na basic advice only.`
  }
  
  return isEmergency
    ? `🚨 EMERGENCY: This sounds serious! Call 112 immediately. If no network, find someone with a phone or go to nearest hospital.

Basic first aid:
- Severe bleeding: Apply direct pressure with clean cloth
- Unconscious: Check breathing, recovery position
- Chest pain: Keep calm, call 112

Nearest hospitals:
${data.hospitalList.slice(0, 3).join('\n')}

⚠️ This is emergency guidance only. Get professional help immediately!`
    
    : `I'm currently offline, but I can provide basic guidance.

For emergencies, call 112. If symptoms are serious, don't wait - go to hospital.

Major hospitals:
${data.hospitalList.slice(0, 3).join('\n')}

⚠️ Please see a doctor for proper diagnosis. This is basic guidance only.`
}