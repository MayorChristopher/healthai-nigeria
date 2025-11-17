// Response filtering and validation for medical AI responses

type FilterResult = {
  isValid: boolean
  filteredResponse: string
  warnings: string[]
}

// Dangerous phrases that should trigger warnings or blocks
const DANGEROUS_PHRASES = [
  'you definitely have',
  'this is definitely',
  'you should not see a doctor',
  'ignore medical advice',
  'don\'t go to hospital',
  'cure yourself',
  'guaranteed cure',
  'medical treatment is unnecessary'
]

// Common grammar/spelling fixes for medical terms
const GRAMMAR_FIXES = [
  { wrong: 'difficulty breathing', correct: 'difficulty in breathing' },
  { wrong: 'trouble breathing', correct: 'difficulty breathing' },
  { wrong: 'cant breathe', correct: "can't breathe" },
  { wrong: 'wont stop', correct: "won't stop" },
  { wrong: 'doesnt feel', correct: "doesn't feel" },
  { wrong: 'isnt normal', correct: "isn't normal" },
  { wrong: 'shouldnt ignore', correct: "shouldn't ignore" },
  { wrong: 'symtoms', correct: 'symptoms' },
  { wrong: 'sympton', correct: 'symptom' },
  { wrong: 'medicin', correct: 'medicine' },
  { wrong: 'hosptial', correct: 'hospital' },
  { wrong: 'docter', correct: 'doctor' }
]

// Required safety phrases that should be in medical responses
const REQUIRED_SAFETY_PHRASES = [
  'see a doctor',
  'consult',
  'medical professional',
  'proper diagnosis',
  'emergency'
]

export function filterMedicalResponse(response: string): FilterResult {
  const warnings: string[] = []
  let filteredResponse = response
  let isValid = true

  // Check for dangerous phrases
  const lowerResponse = response.toLowerCase()
  for (const phrase of DANGEROUS_PHRASES) {
    if (lowerResponse.includes(phrase)) {
      warnings.push(`Contains potentially dangerous advice: "${phrase}"`)
      isValid = false
    }
  }

  // Check if response has safety disclaimers
  const hasSafetyPhrase = REQUIRED_SAFETY_PHRASES.some(phrase => 
    lowerResponse.includes(phrase)
  )

  if (!hasSafetyPhrase && !lowerResponse.includes('emergency')) {
    // Add safety disclaimer if missing
    filteredResponse += '\n\n⚠️ Please consult a healthcare professional for proper diagnosis and treatment.'
    warnings.push('Added missing safety disclaimer')
  }

  // Apply grammar and spelling fixes
  for (const fix of GRAMMAR_FIXES) {
    if (filteredResponse.toLowerCase().includes(fix.wrong)) {
      filteredResponse = filteredResponse.replace(new RegExp(fix.wrong, 'gi'), fix.correct)
      warnings.push(`Fixed grammar: "${fix.wrong}" → "${fix.correct}"`)
    }
  }

  // Block responses that are too definitive
  if (lowerResponse.includes('you have ') && !lowerResponse.includes('might have')) {
    filteredResponse = filteredResponse.replace(/you have /gi, 'you might have ')
    warnings.push('Softened definitive diagnosis language')
  }

  // Ensure emergency responses are flagged
  const emergencyKeywords = ['chest pain', 'difficulty breathing', 'unconscious', 'severe bleeding']
  const hasEmergencyKeyword = emergencyKeywords.some(keyword => 
    lowerResponse.includes(keyword)
  )

  if (hasEmergencyKeyword && !lowerResponse.includes('112')) {
    filteredResponse += '\n\n🚨 This sounds like an emergency. Call 112 immediately.'
    warnings.push('Added emergency contact information')
  }

  return {
    isValid,
    filteredResponse,
    warnings
  }
}

// Additional validation for non-medical responses
export function validateResponseScope(response: string, userMessage: string): boolean {
  const nonMedicalTopics = [
    'weather', 'sports', 'politics', 'entertainment', 
    'cooking', 'travel', 'technology', 'business'
  ]
  
  const lowerMessage = userMessage.toLowerCase()
  const lowerResponse = response.toLowerCase()
  
  // Check if user asked non-medical question
  const isNonMedical = nonMedicalTopics.some(topic => 
    lowerMessage.includes(topic)
  )
  
  // If non-medical question, response should redirect to health topics
  if (isNonMedical) {
    return lowerResponse.includes('health') || lowerResponse.includes('medical')
  }
  
  return true
}