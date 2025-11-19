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
  // Contractions
  { wrong: 'cant breathe', correct: "can't breathe" },
  { wrong: 'wont stop', correct: "won't stop" },
  { wrong: 'doesnt feel', correct: "doesn't feel" },
  { wrong: 'isnt normal', correct: "isn't normal" },
  { wrong: 'shouldnt ignore', correct: "shouldn't ignore" },
  { wrong: 'dont wait', correct: "don't wait" },
  { wrong: 'hasnt improved', correct: "hasn't improved" },
  
  // Medical spelling
  { wrong: 'symtoms', correct: 'symptoms' },
  { wrong: 'sympton', correct: 'symptom' },
  { wrong: 'medicin', correct: 'medicine' },
  { wrong: 'hosptial', correct: 'hospital' },
  { wrong: 'docter', correct: 'doctor' },
  { wrong: 'emergancy', correct: 'emergency' },
  { wrong: 'treatement', correct: 'treatment' },
  { wrong: 'diagosis', correct: 'diagnosis' },
  
  // Grammar improvements
  { wrong: 'you need see', correct: 'you need to see' },
  { wrong: 'go see doctor', correct: 'go see a doctor' },
  { wrong: 'visit hospital', correct: 'visit a hospital' },
  { wrong: 'call doctor', correct: 'call a doctor' },
  { wrong: 'take medicine', correct: 'take the medicine' },
  
  // Common errors
  { wrong: 'alot of', correct: 'a lot of' },
  { wrong: 'loose weight', correct: 'lose weight' },
  { wrong: 'there symptoms', correct: 'their symptoms' },
  { wrong: 'your feeling', correct: "you're feeling" },
  { wrong: 'its important', correct: "it's important" }
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
    const regex = new RegExp('\\b' + fix.wrong.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi')
    if (regex.test(filteredResponse)) {
      filteredResponse = filteredResponse.replace(regex, fix.correct)
      warnings.push(`Fixed grammar: "${fix.wrong}" → "${fix.correct}"`)
    }
  }
  
  // Fix sentence structure issues
  filteredResponse = filteredResponse
    // Ensure proper capitalization after periods
    .replace(/\. ([a-z])/g, (match, letter) => '. ' + letter.toUpperCase())
    // Fix double spaces
    .replace(/  +/g, ' ')
    // Ensure sentences end with proper punctuation
    .replace(/([a-zA-Z])\s*$/g, '$1.')
    // Fix common word order issues
    .replace(/\bvery much important\b/gi, 'very important')
    .replace(/\bmuch very\b/gi, 'very much')

  // Block responses that are too definitive
  if (lowerResponse.includes('you have ') && !lowerResponse.includes('might have') && !lowerResponse.includes('could have')) {
    filteredResponse = filteredResponse.replace(/\byou have ([a-z])/gi, 'you might have $1')
    warnings.push('Softened definitive diagnosis language')
  }
  
  // Fix other definitive language
  filteredResponse = filteredResponse
    .replace(/\bthis is definitely\b/gi, 'this could be')
    .replace(/\byou definitely need\b/gi, 'you should consider')
    .replace(/\bwill cure\b/gi, 'may help with')

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